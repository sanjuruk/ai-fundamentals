# AI Fundamentals

This workspace is for building deep practical understanding of modern AI systems: language-model foundations, post-training, fine-tuning, preference optimization, agent loops, and terminal-agent RL.

The immediate trigger is Hamish Ivison's TMax release: open RL terminal-agent models, datasets, code, and rollouts. The broader goal is to understand the foundations well enough to run experiments and eventually contribute useful work.

The broad learning sequence is anchored on Henry Shi's AI-Crash-Course repo, which is cloned locally at `repos/henrythe9th__AI-Crash-Course/` and snapshotted at `resources/raw/ai-crash-course-readme.md`. The TMax material is the specialization layer on terminal-agent RL.

## What Is Here

- `app/` - Bun/Vite/React web app for tracking the study plan, deployable at `/ai-fundamentals`.
- `papers/` - local PDFs grouped by topic: surveys, LLM foundations, post-training/RL, agents, evaluation, and inference systems.
- `data/tmax/` - local Parquet shards for the smaller TMax datasets and comparison datasets.
- `repos/` - shallow local clones of the GitHub star-list repos plus added practical stacks for post-training, agent evaluation, terminal benchmarks, and interpretability.
- `resources/` - raw source snapshots, screenshots, TMax blog assets, videos/links, and Hugging Face collection metadata.
- `models/` - model links and download notes. Model weights are not downloaded by default.
- `experiments/` - concrete experiment ladder from toy training to terminal-agent RL.
- `STUDY_PLAN.md` - a phased path through the material with compression options.

## Key Sources

- GitHub list: https://github.com/stars/sanjuruk/lists/ai-fundaments
- TMax paper: https://arxiv.org/abs/2606.23321
- TMax blog: https://wai-org.com/blog/tmax/
- TMax code: https://github.com/hamishivi/tmax
- TMax Hugging Face collection: https://huggingface.co/collections/allenai/tmax

## Working Boundary

Downloaded locally:

- 74 PDFs in `papers/`.
- TMax and related dataset Parquet files in `data/tmax/`.
- 20 code repos under `repos/`.
- TMax blog HTML, images, screenshots, and HF metadata under `resources/`.

Not downloaded:

- TMax model weights. They are multi-GB artifacts and should be pulled intentionally per model.
- `allenai/tmax-sft-big`, about 3.26 GB. It is indexed in `resources/README.md` with a download path.

## Suggested Flow

1. Read `STUDY_PLAN.md`.
2. Use `papers/README.md` as the paper map.
3. Use `resources/README.md` for links, videos, source snapshots, and HF model/data notes.
4. Use `experiments/README.md` to start hands-on work.

The north star is not just reading papers. Each phase should end in a small artifact: a note, a model trained, a dataset inspected, an evaluator run, or a terminal-agent loop reproduced.

## Web App

```bash
cd app
bun install
bun run dev
```

Verification:

```bash
cd app
bun run lint
bun run build
bun run build:subpath
```

The app is intentionally client-only. Progress is stored in browser `localStorage`; generated Takumi PNGs are recreated during `dev` and `build`.

## Local Tracking

Use `_local/` at the repo root, or `app/_local/` inside the app, for private study tracking, scratch notes, exported browser progress, temporary logs, and machine-specific files. These folders are git-ignored.

Use `notes/` only for shareable learning notes and experiment writeups that should become part of the repo.

## Vercel Deployment

This repo should be connected to Vercel as a monorepo-style project with the project root set to `app/`.

- Production path: `/ai-fundamentals`
- Framework preset: Vite
- Install command: `bun install --frozen-lockfile`
- Build command: `bun run build:subpath`
- Output directory: `dist`

With Git integration connected, pushes to the production branch create production deployments, and pull requests create preview deployments. Because the Vercel project root is `app/`, app changes should be made under `app/`; study corpus changes outside `app/` are not part of the deployable app.
