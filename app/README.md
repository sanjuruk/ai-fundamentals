# AI Fundamentals Tracker

Client-only study tracker for the phased plan in `../STUDY_PLAN.md`. This app is intended to run under `/ai-fundamentals`.

## Features

- Phase checklist for required and optional study work.
- Free-time session logging with weekly target, streak, and XP.
- Daily quests, study leagues, rest credits, and milestone celebrations.
- Lesson-path navigation for visible progress through the study plan.
- Online workbench for papers, videos, repos, datasets, and reference links.
- Takumi-generated study/share card plus phase-specific visuals.
- Persisted light/dark theme toggle with matching phase visuals.
- Responsive layout for desktop, tablet, and mobile browsers.

Progress is stored in browser `localStorage`; there is no backend or account setup.

## Gamification Approach

The app borrows the durable parts of Duolingo-style engagement:

- Short daily quests: one study window, two required steps, one source completed.
- Streak visibility with rest credits, so missed days do not become a hard failure.
- Leagues based on XP, kept local and non-social for a solo technical study plan.
- Mastery gates: phase completion still depends on required work and exit artifacts.
- Lightweight celebration on meaningful completion, not every click.

Tech choices:

- `react-rewards` for small celebration effects.
- `motion` for path and quest micro-interactions.
- `takumi-js` for generated PNG assets such as the study card and phase cards in `public/`. These are build outputs and are not committed.
- React state plus `localStorage` for local-first progress.
- No backend, auth, routing, or drag/drop library until the app needs multi-device sync or editable curriculum paths.

## Run

```bash
bun install
bun run generate:assets
bun run dev
```

Then open http://127.0.0.1:5173/.

## Verify

```bash
bun run lint
bun run generate:assets
bun run build
bun run build:subpath
```

## Deploy

Connect the repo to Vercel with the project root set to `app/`. Vercel should use the commands from `vercel.json`, including `bun run build:subpath` so assets resolve correctly at `/ai-fundamentals`.
