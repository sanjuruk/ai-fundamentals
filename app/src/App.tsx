import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useReward } from 'react-rewards'
import {
  Award,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ExternalLink,
  FileText,
  GitFork,
  Link as LinkIcon,
  LockKeyhole,
  Moon,
  Play,
  RotateCcw,
  Sun,
  Trophy,
  Video,
  Workflow,
} from 'lucide-react'
import './App.css'
import { Button, Card, Progress, Stat } from './components/ui'
import {
  compressionPaths,
  phases,
  type Phase,
  type ResourceKind,
  type StudyResource,
} from './studyPlan'

type CompletionValue = true | { completedAt: string }

type ProgressState = {
  completed: Record<string, CompletionValue>
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

const defaultProgress: ProgressState = {
  completed: {},
}

const loadProgress = (): ProgressState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      completed: parsed.completed ?? {},
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

const kindLabels: Record<ResourceKind, string> = {
  paper: 'Paper',
  video: 'Video',
  repo: 'Repo',
  doc: 'Doc',
  dataset: 'Dataset',
  site: 'Site',
}

const ResourceIcon = ({ kind }: { kind: ResourceKind }) => {
  if (kind === 'paper') return <FileText aria-hidden="true" size={16} />
  if (kind === 'video') return <Video aria-hidden="true" size={16} />
  if (kind === 'repo') return <GitFork aria-hidden="true" size={16} />
  if (kind === 'dataset') return <Workflow aria-hidden="true" size={16} />
  if (kind === 'doc') return <BookOpen aria-hidden="true" size={16} />
  return <LinkIcon aria-hidden="true" size={16} />
}

const resourceMeta = (resource: StudyResource) =>
  [
    kindLabels[resource.kind],
    resource.optional ? 'optional' : undefined,
    resource.source,
  ].filter(Boolean).join(' / ')

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
  const [scrollTarget, setScrollTarget] = useState<'workbench' | 'phase' | null>(null)
  const workbenchRef = useRef<HTMLElement | null>(null)
  const phaseDetailRef = useRef<HTMLElement | null>(null)

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
  const exitArtifactIds = phases.map((phase) => phase.exitArtifact.id)
  const exitArtifactsDone = exitArtifactIds.filter((id) => completedIds.has(id)).length
  const requiredDone = allRequired.filter((id) => completedIds.has(id)).length
  const overallPercent = allRequired.length === 0 ? 0 : Math.round((requiredDone / allRequired.length) * 100)
  const nextPhase = phases.find((phase) => !phase.optional && (phaseStats.get(phase.id)?.percent ?? 0) < 100) ?? phases[12]
  const selectedResource =
    selectedPhase.resources.find((resource) => resource.id === selectedResourceId) ??
    selectedPhase.resources[0]

  useEffect(() => {
    const phaseResourceIds = selectedPhase.resources.map((resource) => resource.id)
    if (!phaseResourceIds.includes(selectedResourceId)) {
      setSelectedResourceId(selectedPhase.resources[0]?.id ?? '')
    }
  }, [selectedPhase, selectedResourceId])

  useEffect(() => {
    if (!scrollTarget) return
    const target = scrollTarget === 'workbench' ? workbenchRef.current : phaseDetailRef.current
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setScrollTarget(null)
  }, [scrollTarget, selectedPhaseId])

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

  const resetProgress = () => {
    if (!window.confirm('Clear all completed study work?')) return
    setProgress(defaultProgress)
  }

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const isPhaseComplete = (id: string) => (phaseStats.get(id)?.percent ?? 0) === 100
  const milestoneDefs = [
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

  const openPhaseWorkbench = (phaseId: string) => {
    const phase = phases.find((item) => item.id === phaseId)
    setSelectedPhaseId(phaseId)
    if (phase?.resources[0]) {
      setSelectedResourceId(phase.resources[0].id)
    }
    setScrollTarget('workbench')
  }

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
            <p>A simple path through AI fundamentals, with every source one click away.</p>
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
          <Stat label="Current phase" value={`${selectedStats.percent}%`} detail={`Phase ${selectedPhase.number}`} />
          <Stat label="Artifacts" value={`${exitArtifactsDone}/13`} detail="notes shipped" tone="warning" />
          <Button className="reset-button" variant="outline" type="button" onClick={resetProgress}>
            <RotateCcw aria-hidden="true" size={15} />
            Reset
          </Button>
        </Card>
      </header>

      <section className="today-panel" aria-label="Next phase">
        <Card className="next-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">next phase</p>
              <h2>
                Phase {nextPhase.number}: {nextPhase.title}
              </h2>
            </div>
            <Button type="button" variant="outline" onClick={() => openPhaseWorkbench(nextPhase.id)}>
              Open phase
            </Button>
          </div>
          <p>{nextPhase.goal}</p>
          <div className="next-meta">
            <span>{nextPhase.time}</span>
            <span>{phaseStats.get(nextPhase.id)?.percent ?? 0}% complete</span>
          </div>
        </Card>
      </section>

      <section className="resource-workbench featured-workbench" ref={workbenchRef} aria-label="Online workbench">
        <ResourceDeck
          phase={selectedPhase}
          selectedResource={selectedResource}
          selectedResourceId={selectedResourceId}
          onSelect={setSelectedResourceId}
        />
        <ResourceViewer resource={selectedResource} />
      </section>

      <LearningPath
        phases={phases}
        phaseStats={phaseStats}
        selectedPhaseId={selectedPhase.id}
        onSelect={openPhaseWorkbench}
      />

      <div className="study-grid">
        <div className="primary-stack">
          <section className="phase-detail-anchor" ref={phaseDetailRef} aria-label="Selected phase">
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
          </section>
        </div>

        <aside className="side-stack">
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
        <h2>A clear path through the plan.</h2>
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
              aria-label={`Open Phase ${phase.number}: ${phase.title}`}
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
            <h3>Optional resources</h3>
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
                  <small>{resourceMeta(resource)}</small>
                  {resource.context && <em>{resource.context}</em>}
                </span>
              </button>
            </div>
          )
        })}
      </div>
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
