# AI Fundamentals Tracker

Client-only study tracker for the phased plan in `../STUDY_PLAN.md`. This app is intended to run under `/ai-fundamentals`.

## Features

- Phase checklist for required and optional study work.
- Lesson-path navigation for visible progress through the study plan.
- Prominent online workbench for papers, videos, repos, datasets, and reference links.
- Phase-based milestones and lightweight completion celebration.
- Takumi-generated study/share card plus phase-specific visuals.
- Persisted light/dark theme toggle with matching phase visuals.
- Responsive layout for desktop, tablet, and mobile browsers.

Progress is stored in browser `localStorage`; there is no backend or account setup.

## Gamification Approach

The app borrows the durable parts of Duolingo-style engagement:

- A visible path of phases, so progress feels directional.
- Mastery gates based on required work and exit artifacts.
- Milestones for important curriculum unlocks, kept phase-based instead of time-based.
- Lightweight celebration on meaningful completion, not every click.
- Local-only progress, so the tracker stays simple and private.

Tech choices:

- `react-rewards` for small celebration effects.
- `motion` for lesson-path micro-interactions.
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
