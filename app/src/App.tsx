import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useReward } from 'react-rewards'
import {
  Award,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  Gem,
  GitFork,
  Link as LinkIcon,
  LockKeyhole,
  Moon,
  Play,
  RotateCcw,
  ShieldCheck,
  Sun,
  Timer,
  Trophy,
  Video,
  Workflow,
} from 'lucide-react'
import './App.css'
import { Button, Card, Progress, Stat } from './components/ui'
import {
  compressionPaths,
  phases,
  referenceResources,
  type Phase,
  type ResourceKind,
  type StudyResource,
} from './studyPlan'

type StudySession = {
  id: string
  phaseId: string
  minutes: number
  createdAt: string
}

type CompletionValue = true | { completedAt: string }

type ProgressState = {
  completed: Record<string, CompletionValue>
  sessions: StudySession[]
}

type ThemeMode = 'light' | 'dark'

type PhaseStats = {
  percent: number
  requiredDone: number
  requiredTotal: number
  optionalDone: number
  optionalTotal: number
}

const STORAGE_KEY = 'ai-fundamentals-study-progress-v1'
const THEME_STORAGE_KEY = 'ai-fundamentals-theme-v1'
const WEEKLY_TARGET_MINUTES = 360

const defaultProgress: ProgressState = {
  completed: {},
  sessions: [],
}

const loadProgress = (): ProgressState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      completed: parsed.completed ?? {},
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    }
  } catch {
    return defaultProgress
  }
}

const loadTheme = (): ThemeMode => {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

const isCompletedValue = (value: CompletionValue | undefined) => Boolean(value)

const completedAt = (value: CompletionValue | undefined) =>
  typeof value === 'object' && value ? value.completedAt : undefined

const resourceItemId = (phase: Phase, resource: StudyResource) =>
  `${phase.id}:resource:${resource.id}`

const phaseImagePath = (phase: Phase, theme: ThemeMode) => {
  const fileName = `phase-${String(phase.number).padStart(2, '0')}.png`
  return theme === 'dark'
    ? `${import.meta.env.BASE_URL}phase-cards/dark/${fileName}`
    : `${import.meta.env.BASE_URL}phase-cards/${fileName}`
}

const requiredIds = (phase: Phase) => [
  ...phase.resources.filter((resource) => !resource.optional).map((resource) => resourceItemId(phase, resource)),
  ...phase.inspect.map((item) => item.id),
  phase.exitArtifact.id,
]

const optionalIds = (phase: Phase) =>
  phase.resources.filter((resource) => resource.optional).map((resource) => resourceItemId(phase, resource))

const allIds = (phase: Phase) => [...requiredIds(phase), ...optionalIds(phase)]

const getPhaseStats = (phase: Phase, completedIds: Set<string>): PhaseStats => {
  const required = requiredIds(phase)
  const optional = optionalIds(phase)
  const requiredDone = required.filter((id) => completedIds.has(id)).length
  const optionalDone = optional.filter((id) => completedIds.has(id)).length

  return {
    requiredDone,
    requiredTotal: required.length,
    optionalDone,
    optionalTotal: optional.length,
    percent: required.length === 0 ? 100 : Math.round((requiredDone / required.length) * 100),
  }
}

const formatMinutes = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  return remaining ? `${hours}h ${remaining}m` : `${hours}h`
}

const localDayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const completedToday = (completed: Record<string, CompletionValue>, id: string, todayKey: string) => {
  const timestamp = completedAt(completed[id])
  return timestamp ? localDayKey(new Date(timestamp)) === todayKey : false
}

const getStreakDays = (sessions: StudySession[]) => {
  const studiedDays = new Set(sessions.map((session) => localDayKey(new Date(session.createdAt))))
  let streak = 0
  const cursor = new Date()

  while (studiedDays.has(localDayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

const kindLabels: Record<ResourceKind, string> = {
  paper: 'Paper',
  video: 'Video',
  repo: 'Repo',
  doc: 'Doc',
  dataset: 'Dataset',
  site: 'Site',
}

const leagueTiers = [
  { name: 'Bronze', minXp: 0, color: '#a86832' },
  { name: 'Silver', minXp: 120, color: '#77818c' },
  { name: 'Gold', minXp: 280, color: '#ce8a21' },
  { name: 'Sapphire', minXp: 520, color: '#14abbd' },
  { name: 'TMax', minXp: 900, color: '#2e9366' },
]

const getLeague = (xp: number) => {
  const current = [...leagueTiers].reverse().find((tier) => xp >= tier.minXp) ?? leagueTiers[0]
  const index = leagueTiers.findIndex((tier) => tier.name === current.name)
  return {
    current,
    next: leagueTiers[index + 1],
  }
}

const ResourceIcon = ({ kind }: { kind: ResourceKind }) => {
  if (kind === 'paper') return <FileText aria-hidden="true" size={16} />
  if (kind === 'video') return <Video aria-hidden="true" size={16} />
  if (kind === 'repo') return <GitFork aria-hidden="true" size={16} />
  if (kind === 'dataset') return <Workflow aria-hidden="true" size={16} />
  if (kind === 'doc') return <BookOpen aria-hidden="true" size={16} />
  return <LinkIcon aria-hidden="true" size={16} />
}

function App() {
  const { reward: celebrate } = useReward('reward-anchor', 'confetti', {
    elementCount: 80,
    spread: 68,
    startVelocity: 34,
    colors: ['#14abbd', '#2e9366', '#ce8a21', '#181b22'],
  })
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [theme, setTheme] = useState<ThemeMode>(() => loadTheme())
  const [selectedPhaseId, setSelectedPhaseId] = useState(phases[0].id)
  const [selectedResourceId, setSelectedResourceId] = useState(phases[0].resources[0].id)
  const [celebratedQuestDay, setCelebratedQuestDay] = useState<string | null>(null)
  const previousDailyQuestsComplete = useRef<boolean | null>(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const completedIds = useMemo(
    () =>
      new Set(
        Object.entries(progress.completed)
          .filter(([, value]) => isCompletedValue(value))
          .map(([id]) => id),
      ),
    [progress.completed],
  )

  const phaseStats = useMemo(
    () => new Map(phases.map((phase) => [phase.id, getPhaseStats(phase, completedIds)])),
    [completedIds],
  )

  const selectedPhase = phases.find((phase) => phase.id === selectedPhaseId) ?? phases[0]
  const selectedStats = phaseStats.get(selectedPhase.id) ?? getPhaseStats(selectedPhase, completedIds)
  const allRequired = useMemo(() => phases.flatMap((phase) => requiredIds(phase)), [])
  const allTrackable = useMemo(() => phases.flatMap((phase) => allIds(phase)), [])
  const completedTrackable = allTrackable.filter((id) => completedIds.has(id)).length
  const overallPercent = Math.round((allRequired.filter((id) => completedIds.has(id)).length / allRequired.length) * 100)
  const totalMinutes = progress.sessions.reduce((sum, session) => sum + session.minutes, 0)
  const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000
  const weeklyMinutes = progress.sessions
    .filter((session) => new Date(session.createdAt).getTime() >= weekStart)
    .reduce((sum, session) => sum + session.minutes, 0)
  const xp = completedTrackable * 10 + Math.floor(totalMinutes / 15) * 5
  const league = getLeague(xp)
  const streakDays = getStreakDays(progress.sessions)
  const todayKey = localDayKey(new Date())
  const todayMinutes = progress.sessions
    .filter((session) => localDayKey(new Date(session.createdAt)) === todayKey)
    .reduce((sum, session) => sum + session.minutes, 0)
  const resourceIds = phases.flatMap((phase) => phase.resources.map((resource) => resourceItemId(phase, resource)))
  const exitArtifactIds = phases.map((phase) => phase.exitArtifact.id)
  const requiredDoneToday = allRequired.filter((id) => completedToday(progress.completed, id, todayKey)).length
  const resourcesDoneToday = resourceIds.filter((id) => completedToday(progress.completed, id, todayKey)).length
  const exitArtifactsDone = exitArtifactIds.filter((id) => completedIds.has(id)).length
  const restCredits = Math.min(2, Math.floor(weeklyMinutes / WEEKLY_TARGET_MINUTES) + Math.floor(exitArtifactsDone / 3))
  const weeklyPercent = Math.min(100, Math.round((weeklyMinutes / WEEKLY_TARGET_MINUTES) * 100))
  const dailyQuests = [
    {
      id: 'session',
      title: 'Start today',
      detail: 'Log one focused study window.',
      value: Math.min(todayMinutes, 15),
      target: 15,
      unit: 'm',
      done: todayMinutes >= 15,
    },
    {
      id: 'path',
      title: 'Move the path',
      detail: 'Finish two required steps.',
      value: Math.min(requiredDoneToday, 2),
      target: 2,
      unit: 'steps',
      done: requiredDoneToday >= 2,
    },
    {
      id: 'resource',
      title: 'Touch source material',
      detail: 'Complete one paper, video, repo, or dataset.',
      value: Math.min(resourcesDoneToday, 1),
      target: 1,
      unit: 'source',
      done: resourcesDoneToday >= 1,
    },
  ]
  const dailyQuestsComplete = dailyQuests.every((quest) => quest.done)
  const nextPhase = phases.find((phase) => !phase.optional && (phaseStats.get(phase.id)?.percent ?? 0) < 100) ?? phases[12]
  const selectedResource =
    selectedPhase.resources.find((resource) => resource.id === selectedResourceId) ??
    referenceResources.find((resource) => resource.id === selectedResourceId) ??
    selectedPhase.resources[0]

  useEffect(() => {
    const phaseResourceIds = selectedPhase.resources.map((resource) => resource.id)
    const referenceIds = referenceResources.map((resource) => resource.id)
    if (![...phaseResourceIds, ...referenceIds].includes(selectedResourceId)) {
      setSelectedResourceId(selectedPhase.resources[0]?.id ?? referenceResources[0].id)
    }
  }, [selectedPhase, selectedResourceId])

  useEffect(() => {
    const wasComplete = previousDailyQuestsComplete.current
    previousDailyQuestsComplete.current = dailyQuestsComplete

    if (wasComplete !== false) return
    if (!dailyQuestsComplete || celebratedQuestDay === todayKey) return
    celebrate()
    setCelebratedQuestDay(todayKey)
  }, [celebrate, celebratedQuestDay, dailyQuestsComplete, todayKey])

  const toggleItem = (id: string) => {
    const wasCompleted = isCompletedValue(progress.completed[id])
    const owningPhase = phases.find((phase) => allIds(phase).includes(id))
    const beforeStats = owningPhase ? getPhaseStats(owningPhase, completedIds) : undefined

    setProgress((current) => {
      const completed = { ...current.completed }
      if (completed[id]) {
        delete completed[id]
      } else {
        completed[id] = { completedAt: new Date().toISOString() }
      }
      return { ...current, completed }
    })

    if (!wasCompleted && owningPhase && beforeStats && beforeStats.percent < 100) {
      const nextCompletedIds = new Set(completedIds)
      nextCompletedIds.add(id)
      if (getPhaseStats(owningPhase, nextCompletedIds).percent === 100) {
        window.setTimeout(celebrate, 80)
      }
    }
  }

  const addSession = (minutes: number) => {
    setProgress((current) => ({
      ...current,
      sessions: [
        {
          id: `${Date.now()}-${minutes}`,
          phaseId: selectedPhase.id,
          minutes,
          createdAt: new Date().toISOString(),
        },
        ...current.sessions,
      ].slice(0, 80),
    }))
  }

  const resetProgress = () => {
    if (!window.confirm('Clear all completed tasks and study sessions?')) return
    setProgress(defaultProgress)
  }

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const isPhaseComplete = (id: string) => (phaseStats.get(id)?.percent ?? 0) === 100
  const milestoneDefs = [
    {
      id: 'first-window',
      title: 'First study window',
      detail: 'Log 15 minutes.',
      unlocked: totalMinutes >= 15,
    },
    {
      id: 'orientation',
      title: 'Vocabulary booted',
      detail: 'Complete Phase 0.',
      unlocked: isPhaseComplete('p0'),
    },
    {
      id: 'transformer',
      title: 'Transformer traced',
      detail: 'Complete Phases 0-1.',
      unlocked: isPhaseComplete('p0') && isPhaseComplete('p1'),
    },
    {
      id: 'post-training',
      title: 'Post-training map',
      detail: 'Complete Phases 4-6.',
      unlocked: isPhaseComplete('p4') && isPhaseComplete('p5') && isPhaseComplete('p6'),
    },
    {
      id: 'tmax',
      title: 'TMax ready',
      detail: 'Complete the terminal-agent RL deep read.',
      unlocked: isPhaseComplete('p8'),
    },
    {
      id: 'rigor',
      title: 'Verifier mindset',
      detail: 'Complete evaluation and sandboxing.',
      unlocked: isPhaseComplete('p9'),
    },
    {
      id: 'contribution',
      title: 'Real artifact shipped',
      detail: 'Complete Phase 12.',
      unlocked: isPhaseComplete('p12'),
    },
  ]

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <span className="app-mark" aria-hidden="true">
            <BrainCircuit size={22} />
          </span>
          <div>
            <p className="eyebrow">AI fundamentals</p>
            <h1>Study tracker</h1>
            <p>Short sessions, visible progress, and every source one click away.</p>
          </div>
          <Button
            className="theme-toggle"
            variant="outline"
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
          </Button>
        </div>
        <Card className="score-panel" aria-label="Study progress summary">
          <span id="reward-anchor" aria-hidden="true" />
          <Stat label="Plan" value={`${overallPercent}%`} detail="required" tone="success" />
          <Stat label="Streak" value={streakDays} detail="days" />
          <Stat label="Today" value={formatMinutes(todayMinutes)} detail="logged" />
          <Stat label="XP" value={xp} detail={league.current.name} tone="warning" />
        </Card>
      </header>

      <section className="today-panel" aria-label="Today">
        <Card className="next-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">next mission</p>
              <h2>
                Phase {nextPhase.number}: {nextPhase.title}
              </h2>
            </div>
            <Button type="button" variant="outline" onClick={() => setSelectedPhaseId(nextPhase.id)}>
              Open phase
            </Button>
          </div>
          <p>{nextPhase.goal}</p>
          <div className="weekly-meter">
            <span>{formatMinutes(weeklyMinutes)} this week</span>
            <Progress value={weeklyPercent} />
            <span>6h target</span>
          </div>
        </Card>
        <DailyQuests quests={dailyQuests} />
      </section>

      <LearningPath
        phases={phases}
        phaseStats={phaseStats}
        selectedPhaseId={selectedPhase.id}
        onSelect={setSelectedPhaseId}
      />

      <div className="study-grid">
        <div className="primary-stack">
          <Card className="focus-panel">
            <div className="phase-hero">
              <div>
                <p className="eyebrow">
                  Phase {selectedPhase.number} {selectedPhase.optional ? '/ optional' : ''}
                </p>
                <h2>{selectedPhase.title}</h2>
                <p>{selectedPhase.goal}</p>
              </div>
              <div className="phase-progress" aria-label={`${selectedStats.percent}% complete`}>
                <span>{selectedStats.percent}%</span>
                <Progress value={selectedStats.percent} />
                <small>
                  {selectedStats.requiredDone}/{selectedStats.requiredTotal} required
                </small>
              </div>
            </div>

            <div className="artifact-banner">
              <img
                src={phaseImagePath(selectedPhase, theme)}
                alt={`${selectedPhase.title} visual`}
                width={640}
                height={360}
                decoding="async"
              />
              <div>
                <span>phase emphasis</span>
                <strong>{selectedPhase.emphasis}</strong>
              </div>
            </div>

            <Checklist
              phase={selectedPhase}
              completedIds={completedIds}
              onToggle={toggleItem}
            />
          </Card>

          <section className="resource-workbench">
            <ResourceDeck
              phase={selectedPhase}
              selectedResource={selectedResource}
              selectedResourceId={selectedResourceId}
              onSelect={setSelectedResourceId}
            />
            <ResourceViewer resource={selectedResource} />
          </section>
        </div>

        <aside className="side-stack">
          <StudyLog
            sessions={progress.sessions}
            selectedPhase={selectedPhase}
            restCredits={restCredits}
            onAddSession={addSession}
            onReset={resetProgress}
          />
          <LeagueCard xp={xp} league={league} />
          <Milestones milestones={milestoneDefs} />
          <CompressionPaths />
        </aside>
      </div>
    </main>
  )
}

function LearningPath({
  phases,
  phaseStats,
  selectedPhaseId,
  onSelect,
}: {
  phases: Phase[]
  phaseStats: Map<string, PhaseStats>
  selectedPhaseId: string
  onSelect: (id: string) => void
}) {
  return (
    <Card className="learning-path" aria-label="Learning path">
      <div className="path-title">
        <p className="eyebrow">lesson path</p>
        <h2>Short sessions, visible movement.</h2>
      </div>
      <div className="path-track">
        {phases.map((phase) => {
          const stats = phaseStats.get(phase.id)
          const complete = (stats?.percent ?? 0) === 100
          const active = selectedPhaseId === phase.id
          const locked = !complete && phase.number > 0 && (phaseStats.get(phases[phase.number - 1]?.id)?.percent ?? 0) < 50

          return (
            <motion.button
              className="path-node"
              data-active={active}
              data-complete={complete}
              data-locked={locked}
              type="button"
              key={phase.id}
              onClick={() => onSelect(phase.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="node-badge">
                {locked ? (
                  <LockKeyhole aria-hidden="true" size={18} />
                ) : complete ? (
                  <CheckCircle2 aria-hidden="true" size={20} />
                ) : (
                  String(phase.number).padStart(2, '0')
                )}
              </span>
              <span className="node-copy">
                <strong>{phase.title}</strong>
                <small>{stats?.percent ?? 0}% complete</small>
              </span>
            </motion.button>
          )
        })}
      </div>
    </Card>
  )
}

function DailyQuests({
  quests,
}: {
  quests: Array<{
    id: string
    title: string
    detail: string
    value: number
    target: number
    unit: string
    done: boolean
  }>
}) {
  return (
    <Card className="quest-card">
      <div className="panel-title">
        <Gem aria-hidden="true" size={18} />
        <h3>Daily quests</h3>
      </div>
      <div className="quest-list">
        {quests.map((quest) => (
          <motion.div
            className="quest-row"
            data-done={quest.done}
            key={quest.id}
            layout
          >
            <span className="quest-status">
              {quest.done ? <CheckCircle2 aria-hidden="true" size={17} /> : <Circle aria-hidden="true" size={17} />}
            </span>
            <span className="quest-copy">
              <strong>{quest.title}</strong>
              <small>{quest.detail}</small>
              <Progress value={Math.round((quest.value / quest.target) * 100)} tone={quest.done ? 'success' : 'warning'} />
            </span>
            <span className="quest-count">
              {quest.value}/{quest.target} {quest.unit}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

function LeagueCard({
  xp,
  league,
}: {
  xp: number
  league: ReturnType<typeof getLeague>
}) {
  const nextGap = league.next ? league.next.minXp - xp : 0
  const tierStart = league.current.minXp
  const tierEnd = league.next?.minXp ?? xp
  const tierProgress = tierEnd === tierStart ? 100 : Math.round(((xp - tierStart) / (tierEnd - tierStart)) * 100)

  return (
    <Card className="side-card league-card">
      <div className="panel-title">
        <BrainCircuit aria-hidden="true" size={18} />
        <h3>Study league</h3>
      </div>
      <div className="league-badge" style={{ borderColor: league.current.color }}>
        <span>{league.current.name}</span>
        <strong>{xp} XP</strong>
      </div>
      <Progress value={tierProgress} />
      <p>
        {league.next ? `${nextGap} XP to ${league.next.name}.` : 'Top league reached. Keep the streak useful.'}
      </p>
    </Card>
  )
}

function Checklist({
  phase,
  completedIds,
  onToggle,
}: {
  phase: Phase
  completedIds: Set<string>
  onToggle: (id: string) => void
}) {
  return (
    <div className="checklist">
      <div className="panel-title">
        <ListIcon />
        <h3>Required work</h3>
      </div>
      <div className="check-group">
        {phase.resources
          .filter((resource) => !resource.optional)
          .map((resource) => {
            const id = resourceItemId(phase, resource)
            return (
              <label className="check-row" key={id}>
                <input
                  type="checkbox"
                  checked={completedIds.has(id)}
                  onChange={() => onToggle(id)}
                />
                <span>
                  <ResourceIcon kind={resource.kind} />
                  {resource.title}
                </span>
              </label>
            )
          })}
        {phase.inspect.map((item) => (
          <label className="check-row" key={item.id}>
            <input
              type="checkbox"
              checked={completedIds.has(item.id)}
              onChange={() => onToggle(item.id)}
            />
            <span>
              <Workflow aria-hidden="true" size={16} />
              {item.label}
            </span>
          </label>
        ))}
        <label className="check-row exit-row">
          <input
            type="checkbox"
            checked={completedIds.has(phase.exitArtifact.id)}
            onChange={() => onToggle(phase.exitArtifact.id)}
          />
          <span>
            <Trophy aria-hidden="true" size={16} />
            {phase.exitArtifact.label}
          </span>
        </label>
      </div>

      {phase.resources.some((resource) => resource.optional) && (
        <>
          <div className="panel-title optional-title">
            <BookOpen aria-hidden="true" size={17} />
            <h3>Optional reading</h3>
          </div>
          <div className="check-group">
            {phase.resources
              .filter((resource) => resource.optional)
              .map((resource) => {
                const id = resourceItemId(phase, resource)
                return (
                  <label className="check-row optional-row" key={id}>
                    <input
                      type="checkbox"
                      checked={completedIds.has(id)}
                      onChange={() => onToggle(id)}
                    />
                    <span>
                      <ResourceIcon kind={resource.kind} />
                      {resource.title}
                    </span>
                  </label>
                )
              })}
          </div>
        </>
      )}
    </div>
  )
}

function ResourceDeck({
  phase,
  selectedResource,
  selectedResourceId,
  onSelect,
}: {
  phase: Phase
  selectedResource: StudyResource
  selectedResourceId: string
  onSelect: (id: string) => void
}) {
  return (
    <Card className="resource-deck">
      <div className="section-heading">
        <div>
          <p className="eyebrow">online workbench</p>
          <h2>Read, watch, inspect.</h2>
        </div>
        {selectedResource.url && (
          <a className="open-link" href={selectedResource.url} target="_blank" rel="noreferrer">
            Open online
            <ExternalLink aria-hidden="true" size={15} />
          </a>
        )}
      </div>

      <div className="resource-list">
        {phase.resources.map((resource) => {
          const id = resourceItemId(phase, resource)
          return (
            <div className="resource-row" data-active={selectedResourceId === resource.id} key={id}>
              <button className="resource-main" type="button" onClick={() => onSelect(resource.id)}>
                <ResourceIcon kind={resource.kind} />
                <span>
                  <strong>{resource.title}</strong>
                  <small>
                    {kindLabels[resource.kind]}
                    {resource.optional ? ' / optional' : ''}
                    {resource.source ? ` / ${resource.source}` : ''}
                  </small>
                </span>
              </button>
            </div>
          )
        })}
      </div>

      <details className="reference-shelf">
        <summary>Reference shelf</summary>
        <div className="reference-list">
          {referenceResources.map((resource) => (
            <button
              className="reference-chip"
              type="button"
              data-active={selectedResourceId === resource.id}
              key={resource.id}
              onClick={() => onSelect(resource.id)}
            >
              <ResourceIcon kind={resource.kind} />
              <span>{resource.title}</span>
            </button>
          ))}
        </div>
      </details>
    </Card>
  )
}

function ResourceViewer({ resource }: { resource: StudyResource }) {
  const canPreview = Boolean(resource.embedUrl)

  return (
    <Card className="viewer-panel">
      <div className="viewer-topline">
        <span>
          <ResourceIcon kind={resource.kind} />
          {kindLabels[resource.kind]}
        </span>
        {resource.source && <code>{resource.source}</code>}
      </div>
      <div className="viewer-frame-wrap">
        {canPreview ? (
          <iframe
            className="viewer-frame"
            title={resource.title}
            src={resource.embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        ) : (
          <div className="viewer-empty">
            <ExternalLink aria-hidden="true" size={32} />
            <h3>{resource.title}</h3>
            <p>This source is best viewed in its own tab.</p>
            {resource.url && (
              <a href={resource.url} target="_blank" rel="noreferrer">
                Open online
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

function StudyLog({
  sessions,
  selectedPhase,
  restCredits,
  onAddSession,
  onReset,
}: {
  sessions: StudySession[]
  selectedPhase: Phase
  restCredits: number
  onAddSession: (minutes: number) => void
  onReset: () => void
}) {
  return (
    <Card className="side-card">
      <div className="panel-title">
        <Timer aria-hidden="true" size={18} />
        <h3>Free-time log</h3>
      </div>
      <div className="session-buttons" aria-label={`Log time for Phase ${selectedPhase.number}`}>
        {[15, 30, 60].map((minutes) => (
          <Button type="button" key={minutes} onClick={() => onAddSession(minutes)}>
            +{minutes}m
          </Button>
        ))}
      </div>
      <div className="side-metrics">
        <div>
          <ShieldCheck aria-hidden="true" size={16} />
          <span>{restCredits}/2 rest credits</span>
        </div>
      </div>
      <div className="session-history">
        {sessions.length === 0 ? (
          <p>No sessions logged yet.</p>
        ) : (
          sessions.slice(0, 4).map((session) => (
            <div key={session.id}>
              <span>{formatMinutes(session.minutes)}</span>
              <small>
                Phase {phases.find((phase) => phase.id === session.phaseId)?.number ?? '?'} /{' '}
                {new Date(session.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </small>
            </div>
          ))
        )}
      </div>
      <Button className="reset-button" variant="outline" type="button" onClick={onReset}>
        <RotateCcw aria-hidden="true" size={15} />
        Reset local progress
      </Button>
    </Card>
  )
}

function Milestones({
  milestones,
}: {
  milestones: Array<{ id: string; title: string; detail: string; unlocked: boolean }>
}) {
  return (
    <Card className="side-card">
      <div className="panel-title">
        <Award aria-hidden="true" size={18} />
        <h3>Milestones</h3>
      </div>
      <div className="milestone-list">
        {milestones.map((milestone) => (
          <div className="milestone" data-unlocked={milestone.unlocked} key={milestone.id}>
            <Trophy aria-hidden="true" size={17} />
            <span>
              <strong>{milestone.title}</strong>
              <small>{milestone.detail}</small>
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function CompressionPaths() {
  return (
    <Card className="side-card compression-card">
      <div className="panel-title">
        <Play aria-hidden="true" size={18} />
        <h3>Compression paths</h3>
      </div>
      {compressionPaths.map((path) => (
        <details key={path.id}>
          <summary>{path.title}</summary>
          <ol>
            {path.phases.map((phase) => (
              <li key={phase}>{phase}</li>
            ))}
          </ol>
        </details>
      ))}
    </Card>
  )
}

function ListIcon() {
  return <CheckCircle2 aria-hidden="true" size={18} />
}

export default App
