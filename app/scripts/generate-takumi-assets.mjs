import { mkdir, writeFile } from 'node:fs/promises'
import React from 'react'
import { render } from 'takumi-js'

const h = React.createElement
const gridBackground = (lineColor) => ({
  backgroundImage:
    `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`,
  backgroundSize: '42px 42px',
  fontFamily: 'Nunito Sans, Arial, sans-serif',
})

const cardThemes = {
  light: {
    name: 'light',
    bg: '#f7f9fb',
    surface: '#ffffff',
    soft: '#ffffff',
    ink: '#181b22',
    muted: '#647077',
    line: '#dce4ea',
    eyebrow: '#0f6674',
    grid: 'rgba(24,27,34,0.06)',
    terminal: '#181b22',
  },
  dark: {
    name: 'dark',
    bg: '#10141b',
    surface: '#171d26',
    soft: '#f4f7fb',
    ink: '#f4f7fb',
    muted: '#a8b3bd',
    line: '#2c3745',
    eyebrow: '#82e0e9',
    grid: 'rgba(244,247,251,0.075)',
    terminal: '#071015',
  },
}

const phaseLabels = [
  'Orientation',
  'Transformers',
  'Data',
  'Post-training',
  'Agents',
  'TMax RL',
  'Evaluation',
]

const pill = (label, tone = 'neutral') =>
  h(
    'div',
    {
      tw: `px-5 py-3 rounded-full border text-[24px] font-bold ${
        tone === 'active'
          ? 'bg-[#14abbd] text-white border-[#14abbd]'
          : 'bg-white text-[#181b22] border-[#dce4ea]'
      }`,
    },
    label,
  )

const phaseCards = [
  { number: 0, title: 'Vocabulary map', motif: 'map', accent: '#14abbd' },
  { number: 1, title: 'Transformer loop', motif: 'attention', accent: '#2e9366' },
  { number: 2, title: 'Open model recipe', motif: 'model', accent: '#ce8a21' },
  { number: 3, title: 'Data filter', motif: 'data', accent: '#0f6674' },
  { number: 4, title: 'Preference pairs', motif: 'preference', accent: '#a86832' },
  { number: 5, title: 'Training stack', motif: 'stack', accent: '#77818c' },
  { number: 6, title: 'Verifier rewards', motif: 'verifier', accent: '#2e9366' },
  { number: 7, title: 'Agent tools', motif: 'tools', accent: '#14abbd' },
  { number: 8, title: 'Terminal RL', motif: 'terminal', accent: '#2e9366' },
  { number: 9, title: 'Evaluation sandbox', motif: 'sandbox', accent: '#ce8a21' },
  { number: 10, title: 'Serving systems', motif: 'infra', accent: '#0f6674' },
  { number: 11, title: 'Mechanistic lens', motif: 'lens', accent: '#77818c' },
  { number: 12, title: 'Contribution loop', motif: 'contribution', accent: '#2e9366' },
]

const rect = ({ left, top, width, height, color, text = '', border = '#dce4ea', radius = 18 }) =>
  h(
    'div',
    {
      tw: 'absolute flex items-center justify-center text-[20px] font-black',
      style: {
        left,
        top,
        width,
        height,
        backgroundColor: color,
        border: `2px solid ${border}`,
        borderRadius: `${radius}px`,
      },
    },
    text,
  )

const line = ({ left, top, width, height = 6, color = '#dce4ea' }) =>
  h('div', {
    tw: 'absolute rounded-full',
    style: { left, top, width, height, backgroundColor: color },
  })

const dot = ({ left, top, size = 24, color }) =>
  h('div', {
    tw: 'absolute rounded-full',
    style: {
      left,
      top,
      width: size,
      height: size,
      backgroundColor: color,
      border: ['#ffffff', '#f4f7fb'].includes(color) ? '2px solid #dce4ea' : '0',
    },
  })

const visualNodes = (phase, theme = cardThemes.light) => {
  const soft = theme.soft
  const muted = theme.line
  const dark = theme.terminal
  const accent = phase.accent

  if (phase.motif === 'map') {
    return [
      rect({ left: 24, top: 28, width: 86, height: 52, color: soft, text: 'LLM' }),
      rect({ left: 168, top: 28, width: 86, height: 52, color: soft, text: 'RL' }),
      rect({ left: 96, top: 112, width: 86, height: 52, color: accent, text: 'AI', border: accent }),
      line({ left: 104, top: 54, width: 70, color: accent }),
      line({ left: 126, top: 84, width: 54, color: muted }),
      dot({ left: 52, top: 130, color: accent }),
      dot({ left: 228, top: 130, color: dark }),
    ]
  }

  if (phase.motif === 'attention') {
    return [
      ...[0, 1, 2, 3].flatMap((column) =>
        [0, 1, 2].map((row) =>
          dot({
            left: 30 + column * 68,
            top: 34 + row * 48,
            size: 28,
            color: column === 2 ? accent : soft,
          }),
        ),
      ),
      line({ left: 58, top: 48, width: 184, color: accent }),
      line({ left: 58, top: 96, width: 184, color: muted }),
      line({ left: 58, top: 144, width: 184, color: accent }),
    ]
  }

  if (phase.motif === 'model') {
    return [
      rect({ left: 24, top: 36, width: 62, height: 126, color: soft, text: 'D' }),
      rect({ left: 108, top: 20, width: 70, height: 60, color: soft, text: 'E1' }),
      rect({ left: 108, top: 96, width: 70, height: 60, color: accent, text: 'E2', border: accent }),
      rect({ left: 202, top: 36, width: 62, height: 126, color: soft, text: 'M' }),
      line({ left: 86, top: 64, width: 22, color: accent }),
      line({ left: 178, top: 64, width: 24, color: accent }),
      line({ left: 178, top: 126, width: 24, color: muted }),
    ]
  }

  if (phase.motif === 'data') {
    return [
      ...[0, 1, 2, 3, 4].map((index) =>
        rect({
          left: 24 + index * 48,
          top: 26,
          width: 34,
          height: 34,
          color: index % 2 ? soft : accent,
          text: String(index + 1),
          border: index % 2 ? muted : accent,
          radius: 10,
        }),
      ),
      rect({ left: 70, top: 86, width: 150, height: 42, color: soft, text: 'filter' }),
      rect({ left: 106, top: 150, width: 82, height: 34, color: accent, text: 'clean', border: accent }),
    ]
  }

  if (phase.motif === 'preference') {
    return [
      rect({ left: 28, top: 34, width: 92, height: 112, color: soft, text: 'A' }),
      rect({ left: 168, top: 34, width: 92, height: 112, color: soft, text: 'B' }),
      line({ left: 126, top: 84, width: 36, color: accent }),
      rect({ left: 62, top: 164, width: 164, height: 18, color: accent, border: accent, radius: 999 }),
    ]
  }

  if (phase.motif === 'stack') {
    return [
      rect({ left: 42, top: 24, width: 204, height: 34, color: soft, text: 'data' }),
      rect({ left: 42, top: 72, width: 204, height: 34, color: soft, text: 'sft' }),
      rect({ left: 42, top: 120, width: 204, height: 34, color: accent, text: 'rl', border: accent }),
      rect({ left: 42, top: 168, width: 204, height: 34, color: soft, text: 'eval' }),
    ]
  }

  if (phase.motif === 'verifier') {
    return [
      rect({ left: 30, top: 42, width: 78, height: 64, color: soft, text: 'try' }),
      rect({ left: 178, top: 42, width: 78, height: 64, color: soft, text: 'test' }),
      rect({ left: 104, top: 132, width: 78, height: 64, color: accent, text: 'OK', border: accent }),
      line({ left: 108, top: 72, width: 70, color: accent }),
      line({ left: 140, top: 108, width: 6, height: 28, color: accent }),
    ]
  }

  if (phase.motif === 'tools') {
    return [
      rect({ left: 104, top: 72, width: 84, height: 64, color: accent, text: 'agent', border: accent }),
      dot({ left: 34, top: 34, color: soft }),
      dot({ left: 238, top: 34, color: soft }),
      dot({ left: 34, top: 162, color: soft }),
      dot({ left: 238, top: 162, color: soft }),
      line({ left: 62, top: 48, width: 72, color: accent }),
      line({ left: 162, top: 48, width: 76, color: accent }),
      line({ left: 62, top: 176, width: 72, color: muted }),
      line({ left: 162, top: 176, width: 76, color: muted }),
    ]
  }

  if (phase.motif === 'terminal') {
    return [
      rect({ left: 22, top: 26, width: 244, height: 158, color: dark, border: dark, radius: 16 }),
      line({ left: 42, top: 58, width: 88, color: accent }),
      line({ left: 42, top: 92, width: 170, color: '#ffffff' }),
      line({ left: 42, top: 126, width: 132, color: accent }),
      rect({ left: 196, top: 136, width: 44, height: 28, color: accent, text: '+', border: accent, radius: 10 }),
    ]
  }

  if (phase.motif === 'sandbox') {
    return [
      rect({ left: 34, top: 34, width: 98, height: 128, color: soft, text: 'eval' }),
      rect({ left: 160, top: 34, width: 98, height: 128, color: soft, text: 'box' }),
      rect({ left: 98, top: 84, width: 92, height: 52, color: accent, text: 'safe', border: accent }),
    ]
  }

  if (phase.motif === 'infra') {
    return [
      rect({ left: 30, top: 28, width: 68, height: 154, color: soft }),
      rect({ left: 112, top: 28, width: 68, height: 154, color: soft }),
      rect({ left: 194, top: 28, width: 68, height: 154, color: soft }),
      ...[48, 80, 112, 144].flatMap((top) => [
        line({ left: 46, top, width: 36, color: accent }),
        line({ left: 128, top, width: 36, color: muted }),
        line({ left: 210, top, width: 36, color: accent }),
      ]),
    ]
  }

  if (phase.motif === 'lens') {
    return [
      rect({ left: 42, top: 40, width: 176, height: 118, color: soft, text: 'circuit' }),
      dot({ left: 72, top: 70, color: accent }),
      dot({ left: 142, top: 92, color: dark }),
      dot({ left: 188, top: 124, color: accent }),
      line({ left: 96, top: 84, width: 56, color: accent }),
      line({ left: 164, top: 112, width: 40, color: muted }),
      rect({ left: 204, top: 138, width: 54, height: 20, color: dark, border: dark, radius: 999 }),
    ]
  }

  return [
    rect({ left: 34, top: 34, width: 96, height: 116, color: soft, text: 'PR' }),
    rect({ left: 158, top: 34, width: 96, height: 116, color: soft, text: 'ship' }),
    line({ left: 130, top: 82, width: 30, color: accent }),
    rect({ left: 88, top: 168, width: 116, height: 32, color: accent, text: 'done', border: accent }),
  ]
}

const PhaseCard = (phase, theme = cardThemes.light) =>
  h(
    'div',
    {
      tw: 'w-full h-full flex p-8',
      style: {
        ...gridBackground(theme.grid),
        backgroundColor: theme.bg,
        color: theme.ink,
      },
    },
    h(
      'div',
      { tw: 'w-[238px] flex flex-col justify-between' },
      h(
        'div',
        null,
        h(
          'div',
          {
            tw: 'text-[18px] font-black uppercase tracking-wide',
            style: { color: theme.eyebrow },
          },
          `Phase ${String(phase.number).padStart(2, '0')}`,
        ),
        h(
          'div',
          {
            tw: 'mt-4 text-[42px] font-black leading-[0.95]',
            style: { fontFamily: 'Space Grotesk, Nunito Sans, Arial, sans-serif' },
          },
          phase.title,
        ),
      ),
      h('div', { tw: 'w-[132px] h-[14px] rounded-full', style: { backgroundColor: phase.accent } }),
    ),
    h(
      'div',
      {
        tw: 'relative flex-1 rounded-[28px] ml-8 overflow-hidden',
        style: {
          backgroundColor: theme.surface,
          border: `1px solid ${theme.line}`,
        },
      },
      visualNodes(phase, theme),
    ),
  )

const StudyCard = h(
  'div',
  {
    tw: 'w-full h-full flex flex-col bg-[#f7f9fb] text-[#181b22] p-14',
    style: gridBackground(cardThemes.light.grid),
  },
  h(
    'div',
    { tw: 'flex justify-between items-start' },
    h(
      'div',
      { tw: 'flex flex-col' },
      h('div', { tw: 'text-[#0f6674] text-[24px] font-black tracking-wide uppercase' }, 'AI fundamentals'),
      h(
        'div',
        {
          tw: 'mt-4 text-[76px] font-black leading-[0.93] tracking-tight',
          style: { fontFamily: 'Space Grotesk, Nunito Sans, Arial, sans-serif' },
        },
        'Study tracker',
      ),
      h(
        'div',
        { tw: 'mt-5 text-[30px] text-[#647077]' },
        'Short sessions. Visible progress. Sources one click away.',
      ),
    ),
    h(
      'div',
      { tw: 'w-[150px] h-[150px] flex items-center justify-center rounded-[28px] bg-[#181b22] text-white' },
      h('div', { tw: 'text-[74px] font-black' }, 'AI'),
    ),
  ),
  h(
    'div',
    { tw: 'mt-16 flex gap-5 flex-wrap' },
    phaseLabels.map((label, index) => pill(label, index === 0 ? 'active' : 'neutral')),
  ),
  h(
    'div',
    { tw: 'mt-auto flex justify-between items-end' },
    h(
      'div',
      { tw: 'flex gap-5' },
      h(
        'div',
        { tw: 'w-[250px] rounded-[18px] bg-white border border-[#dce4ea] p-6 flex flex-col' },
        h('div', { tw: 'text-[54px] font-black text-[#2e9366]' }, '13'),
        h('div', { tw: 'text-[22px] text-[#647077] uppercase tracking-wide' }, 'phases'),
      ),
      h(
        'div',
        { tw: 'w-[250px] rounded-[18px] bg-white border border-[#dce4ea] p-6 flex flex-col' },
        h('div', { tw: 'text-[54px] font-black text-[#ce8a21]' }, '6h'),
        h('div', { tw: 'text-[22px] text-[#647077] uppercase tracking-wide' }, 'weekly target'),
      ),
    ),
    h(
      'div',
      { tw: 'text-right text-[24px] text-[#647077]' },
      'Papers / videos / repos / datasets',
    ),
  ),
)

const image = await render(StudyCard, { width: 1200, height: 630 })

await writeFile('public/ai-fundamentals-study-card.png', image)
console.log('Generated public/ai-fundamentals-study-card.png')

await mkdir('public/phase-cards', { recursive: true })
await mkdir('public/phase-cards/dark', { recursive: true })

for (const [themeName, theme] of Object.entries(cardThemes)) {
  for (const phase of phaseCards) {
    const phaseImage = await render(PhaseCard(phase, theme), { width: 640, height: 360 })
    const phasePath =
      themeName === 'dark'
        ? `public/phase-cards/dark/phase-${String(phase.number).padStart(2, '0')}.png`
        : `public/phase-cards/phase-${String(phase.number).padStart(2, '0')}.png`
    await writeFile(phasePath, phaseImage)
    console.log(`Generated ${phasePath}`)
  }
}
