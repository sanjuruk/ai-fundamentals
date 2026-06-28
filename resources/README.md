# Resources

This directory stores source snapshots and links that are useful but not best represented as papers, repos, or datasets.

## Raw Source Snapshots

- GitHub star list: https://github.com/stars/sanjuruk/lists/ai-fundaments
- `raw/ai-crash-course-readme.md` - local snapshot of Henry Shi's AI-Crash-Course README, used as the broad study-plan backbone.
- `raw/tmax-blog.html` - TMax blog HTML snapshot.
- `raw/hf-tmax-collection.json` - Hugging Face collection metadata.
- `raw/hf-*-size.json` and `raw/hf-*-parquet.json` - Hugging Face Dataset Viewer metadata.
- `raw/hf-tmax-15k-first-rows.json` - first rows/schema from `allenai/TMax-15K`.

## Screenshots

- `screenshots/tmax-thread-01.png`
- `screenshots/tmax-thread-02.png`
- `screenshots/tmax-thread-03.png`

These preserve the X thread context that triggered the project.

## TMax Blog Images

- `images/tmax-logo.png`
- `images/tmax-teaser.png`
- `images/tmax-data-pipeline.png`
- `images/tmax-data-composition.png`
- `images/tmax-step-count.png`
- `images/tmax-turn-tokens.png`
- `images/tmax-fp32-lm-head.png`

## Videos And Courses

Start here:

- 3Blue1Brown neural network to LLM series: https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi
- Karpathy Zero to Hero: https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ
- Karpathy GPT video: https://www.youtube.com/watch?v=kCc8FmEb1nY
- Noam Brown on planning in AI: https://www.youtube.com/watch?v=eaAonE58sLU
- Stanford Building LLMs: https://www.youtube.com/watch?v=9vM4p9NN0Ts
- Yannic Kilcher paper explanations: https://www.youtube.com/@YannicKilcher
- Full Stack Deep Learning: https://fullstackdeeplearning.com/

Reference sites:

- Prompting Guide: https://www.promptingguide.ai/
- a16z AI Canon: https://a16z.com/ai-canon/
- Latent Space 2025 AI Engineer reading list: https://www.latent.space/p/2025-papers
- State of Generative Models 2024: https://nrehiew.github.io/blog/2024/

Security and sandboxing:

- OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- Docker rootless mode: https://docs.docker.com/engine/security/rootless/
- Docker seccomp security profiles: https://docs.docker.com/engine/security/seccomp/
- Docker runtime privilege and Linux capabilities: https://docs.docker.com/engine/containers/run/#runtime-privilege-and-linux-capabilities

## TMax Links

- Paper: https://arxiv.org/abs/2606.23321
- Blog: https://wai-org.com/blog/tmax/
- Code: https://github.com/hamishivi/tmax
- Hugging Face collection: https://huggingface.co/collections/allenai/tmax
- Terminal Bench leaderboard: https://www.tbench.ai/leaderboard/terminal-bench/2.0
- Terminal Bench site: https://www.tbench.ai/

## TMax Data Notes

Downloaded local datasets are listed in `data/README.md`.

Indexed but not downloaded:

- `allenai/tmax-sft-big` - 327,299 rows, about 3.26 GB Parquet.

Download command for the large dataset:

```bash
mkdir -p data/tmax/allenai__tmax-sft-big
curl -L -o data/tmax/allenai__tmax-sft-big/default-train-0000.parquet \
  "https://huggingface.co/datasets/allenai/tmax-sft-big/resolve/refs%2Fconvert%2Fparquet/default/train/0000.parquet"
```
