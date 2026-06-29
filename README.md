# AI Fundamentals

A structured AI fundamentals curriculum and study tracker for learning modern LLM systems, post-training, agents, evaluation, and terminal-agent reinforcement learning.

This repo is not a library or benchmark package. It is a working learning resource: a phased study plan, a curated paper map, local source snapshots, experiment ladders, TMax-focused datasets, and a browser app for tracking phase progress and source completion.

Web app: https://sanjuruk.com/ai-fundamentals

## Why This Exists

Modern AI is easier to follow when the pieces are studied in order:

1. Transformers and pretraining.
2. Data, tokenization, contamination, and retrieval.
3. Fine-tuning, preference optimization, and RLHF.
4. Verifier-backed RL and reasoning.
5. Agent harnesses, terminal environments, evaluation, and security.
6. Systems, serving, and debugging.

The immediate trigger for this repo was Hamish Ivison's TMax release: open terminal-agent RL models, datasets, code, and rollouts. The broader goal is to build enough foundation to run credible experiments in fine-tuning, post-training, RL with verifiable rewards, and terminal-agent loops.

## Who This Is For

Use this repo if you want a practical path through AI fundamentals and you are willing to produce artifacts as you learn. Each phase ends with a note, diagram, inspection, toy run, harness, evaluator, or reproduction slice.

This is optimized for someone studying part-time, roughly 6-10 focused hours per week. If a week is busy, do the required reading plus the exit artifact and skip optional reading. Do not advance because time passed. Advance when the exit criteria are true.

## Start Here

1. Read [STUDY_PLAN.md](STUDY_PLAN.md).
2. Open the tracker at [sanjuruk.com/ai-fundamentals](https://sanjuruk.com/ai-fundamentals), or run it locally from [app](app/).
3. Use [papers/README.md](papers/README.md) as the paper map.
4. Use [resources/README.md](resources/README.md) for videos, source snapshots, TMax links, and dataset metadata.
5. Use [experiments/README.md](experiments/README.md) when a phase asks you to inspect code or build a toy version.
6. Write shareable learning artifacts in [notes](notes/). Use `_local/` for private progress tracking and scratch work.

## Study Plan

The study plan is the core of the repo. It follows Henry Shi's AI-Crash-Course sequence for the broad curriculum, then layers TMax and terminal-agent RL on top as the specialization track.

| Phase | Focus | Exit artifact |
| --- | --- | --- |
| 0 | Orientation and vocabulary | `notes/00-vocabulary.md` glossary for the main AI systems terms |
| 1 | Transformers and pretraining basics | `notes/01-nanogpt.md` after tracing and running nanoGPT |
| 2 | Modern open model recipes | `notes/02-modern-recipes.md` pipeline from data to serving |
| 3 | Data, tokenization, and contamination | `notes/03-data.md` on filtering, deduplication, data mixing, and benchmark leakage |
| 4 | Fine-tuning and preference optimization | `notes/04-post-training.md` comparing SFT, RLHF, DPO, KTO, ORPO, SimPO, and RLAIF |
| 5 | Open post-training stacks | `notes/05-post-training-stacks.md` choosing local and future multi-GPU stacks |
| 6 | RL for reasoning and verifiable rewards | `notes/06-rlvr.md` plus a toy verifier-backed reward task |
| 7 | Agents, tools, and software benchmarks | `notes/07-agent-harness.md` plus a tiny terminal harness |
| 8 | Terminal-agent RL and TMax | `notes/08-tmax.md` plus one source-backed TMax reproduction slice |
| 9 | Evaluation rigor, security, and sandboxing | `notes/09-eval-security.md` covering leakage, sandboxing, and prompt injection |
| 10 | Systems, serving, and training infra | `notes/10-systems.md` covering attention, KV cache, speculative decoding, ZeRO, and Megatron |
| 11 | Interpretability and debugging | `notes/11-interpretability.md` or one small probe |
| 12 | First real contribution loop | `notes/12-contribution.md` plus a concrete issue, PR, repro, or experiment proposal |

Read the full plan in [STUDY_PLAN.md](STUDY_PLAN.md). That file has required papers, optional papers, build tasks, and exit criteria for each phase.

## Repository Map

| Path | Purpose |
| --- | --- |
| [STUDY_PLAN.md](STUDY_PLAN.md) | The phased curriculum and source of truth for what to study next. |
| [app](app/) | Bun/Vite/React study tracker with phase milestones, local progress, dark mode, and online links. |
| [papers](papers/) | Local PDF library grouped by topic. The PDFs are ignored by git; [papers/README.md](papers/README.md) is the committed index. |
| [resources](resources/) | Videos, source snapshots, TMax blog assets, Hugging Face metadata, and useful external links. |
| [data](data/) | Local dataset notes. Large Parquet shards are ignored by git and should be downloaded intentionally. |
| [repos](repos/) | Local shallow clones of source repos used for inspection. Clone contents are ignored; [repos/README.md](repos/README.md) records what belongs here. |
| [experiments](experiments/) | Practical experiment ladder from toy training to terminal-agent RL. |
| [models](models/) | Model links and download notes. Model weights are not committed. |
| [notes](notes/) | Shareable learning notes and experiment writeups. |
| `_local/` | Private local tracking, scratch notes, exported progress, and machine-specific files. Ignored by git. |

## Learning Resources Included

The repo currently indexes:

- 74 local PDFs across surveys, LLM foundations, post-training/RL, reasoning and agents, evaluation, systems, data, security, and interpretability.
- TMax and related dataset metadata, with local Parquet shards kept out of git.
- 20 local source repos for inspection, including nanoGPT, nanochat, OpenRLHF, verl, TRL, open-instruct, terminal-bench, mini-swe-agent, reward-bench, vLLM, DCLM, and interpretability tooling.
- TMax blog HTML, images, Hugging Face collection metadata, and source links.
- A browser-based progress tracker for phase work and online source access.

Key external anchors:

- GitHub star list: https://github.com/stars/sanjuruk/lists/ai-fundaments
- AI-Crash-Course: https://github.com/henrythe9th/AI-Crash-Course
- TMax paper: https://arxiv.org/abs/2606.23321
- TMax blog: https://wai-org.com/blog/tmax/
- TMax code: https://github.com/hamishivi/tmax
- TMax Hugging Face collection: https://huggingface.co/collections/allenai/tmax

## Run The Study Tracker

Requirements:

- Bun
- A modern desktop or mobile browser

```bash
cd app
bun install
bun run dev
```

Open http://127.0.0.1:5173/.

Progress is stored in browser `localStorage`. There is no backend, account system, or multi-device sync.

## Verify The App

```bash
cd app
bun run lint
bun audit
bun run build
bun run build:subpath
```

`build:subpath` is the production build for `/ai-fundamentals`. It regenerates Takumi PNG assets during the build; those generated files are ignored and should not be committed.

## Deployment

The app is designed to be hosted as a separate Vercel project mounted from `sanjuruk.com/ai-fundamentals`.

Vercel project settings:

- Project root: `app`
- Framework preset: Vite
- Install command: `bun install --frozen-lockfile`
- Build command: `bun run build:subpath`
- Output directory: `dist`
- Ignored build step: `git diff --quiet HEAD^ HEAD -- :/app`

Once the GitHub repo is connected to Vercel, pushes to `main` that touch `app/` should trigger production deployments. Pull requests should create preview deployments. Changes outside `app/` are study-corpus changes and should be skipped by the ignored build step.

## Local Data And Git Boundaries

This repo intentionally keeps source and indexes in git, while keeping heavy or personal state local.

Committed:

- Study plan and README files.
- App source and lockfile.
- Paper, data, model, repo, and resource indexes.
- Lightweight source snapshots and TMax images.

Ignored:

- `node_modules/`, `dist/`, Vercel state, agent state, generated Takumi PNGs.
- `_local/` and `.local/` private tracking folders.
- Local PDF files under `papers/`.
- Local Parquet/data shards under `data/`.
- Model weights and large artifacts.
- Cloned repo contents under `repos/`.

## Suggested Workflow

1. Pick the current phase in [STUDY_PLAN.md](STUDY_PLAN.md).
2. Read only the required sources first.
3. Use the tracker to open sources, mark completion, and follow phase progress.
4. Produce the phase exit artifact in [notes](notes/).
5. Only then move to the next phase.

The north star is not just reading papers. Each phase should leave behind something concrete enough to inspect later: a note, a model trained, a dataset profile, an evaluator run, a harness, or a reproduction slice.

## Status

Active learning workspace. The app is usable now, the curriculum is source-backed, and local data is intentionally separated from committed repo state.

## License

No license file has been added yet. Until a license is added, treat the repository contents as not licensed for reuse.
