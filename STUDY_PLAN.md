# Study Plan

Target: build enough foundation to run credible experiments in fine-tuning, post-training, RL with verifiable rewards, and terminal-agent loops.

Assumption: normal-human pace, roughly 6-10 focused hours per week. If a week is busy, do the required reading plus the exit artifact and skip optional reading. Do not advance just because time passed; advance when the exit criteria are true.

## How To Use This Plan

Each phase has:

- Goal: what you are trying to understand.
- Read: local papers or repo docs.
- Build/inspect: concrete work in this repo.
- Exit artifact: the thing you write or run before moving on.

The broad sequence follows Henry Shi's AI-Crash-Course at `repos/henrythe9th__AI-Crash-Course/README.md`: videos first, surveys next, starred foundation papers, then deeper branches. TMax is layered on as the specialization track for terminal-agent RL.

## Phase 0: Orientation And Vocabulary

Time: 2-3 days.

Goal: stop the field from feeling like a bag of unrelated acronyms.

Read:

- `resources/raw/ai-crash-course-readme.md`
- `papers/00-surveys/foundations-of-large-language-models-2501.09223.pdf` - skim chapters/sections that define the pipeline.
- `papers/00-surveys/large-language-models-a-survey-2402.06196.pdf` - skim.
- `papers/00-surveys/a-survey-on-large-language-model-based-autonomous-agents-2308.11432.pdf` - skim.

Watch:

- 3Blue1Brown neural-network-to-LLM sequence from `resources/README.md`.

Build/inspect:

- Skim every top-level README in `repos/`.

Exit artifact:

- Create `notes/00-vocabulary.md` defining: pretraining, SFT, RLHF, DPO, PPO, GRPO, RLVR, reward model, verifier, rollout, benchmark, harness, agent, environment, context, prompt injection, contamination.

## Phase 1: Transformers And Pretraining Basics

Time: 1 week.

Goal: understand the core training loop and model shape.

Read:

- `papers/01-llm-foundations/attention-is-all-you-need-1706.03762.pdf`
- `papers/01-llm-foundations/scaling-laws-for-neural-language-models-2001.08361.pdf`
- `papers/01-llm-foundations/language-models-are-few-shot-learners-2005.14165.pdf`
- `papers/01-llm-foundations/training-compute-optimal-large-language-models-2203.15556.pdf`

Build/inspect:

- Run the smallest Shakespeare path in `repos/karpathy__nanoGPT`.
- Trace `repos/karpathy__nanoGPT/model.py` and `train.py`.

Exit artifact:

- `notes/01-nanogpt.md`: explain attention, MLP, residual stream, tokenization, loss, optimizer, context length, sampling, and what changed when you ran it.

## Phase 2: Modern Open Model Recipes

Time: 1 week.

Goal: understand how real open models differ from toy pretraining.

Read:

- `papers/01-llm-foundations/the-llama-3-herd-of-models-2407.21783.pdf`
- `papers/01-llm-foundations/deepseek-v3-technical-report-2412.19437.pdf`
- `papers/01-llm-foundations/gemini-1-5-unlocking-multimodal-understanding-across-millions-of-tokens-of-context-2403.05530.pdf`
- `papers/01-llm-foundations/mixtral-of-experts-2401.04088.pdf`

Build/inspect:

- Inspect `repos/karpathy__nanochat/runs/speedrun.sh`.
- Inspect `repos/karpathy__nanochat/nanochat/`.

Exit artifact:

- `notes/02-modern-recipes.md`: draw the pipeline from raw data to serving: tokenization, data mix, pretrain, midtrain, SFT, preference/RL, eval, serving. Also list which parts are locally feasible and which require cluster compute.

## Phase 3: Data, Tokenization, And Contamination

Time: 1 week.

Goal: understand that model quality is often data quality.

Read:

- `papers/07-data-and-pretraining/datacomp-lm-in-search-of-the-next-generation-of-training-sets-for-language-models-2406.11794.pdf`
- `papers/07-data-and-pretraining/the-fineweb-datasets-decanting-the-web-for-the-finest-text-data-at-scale-2406.17557.pdf`
- `papers/00-surveys/a-survey-of-context-engineering-for-large-language-models-2507.13334.pdf` - focus on retrieval/context sections.
- `papers/03-reasoning-and-agents/retrieval-augmented-generation-for-knowledge-intensive-nlp-tasks-2005.11401.pdf`
- Optional: `papers/03-reasoning-and-agents/self-rag-learning-to-retrieve-generate-and-critique-through-self-reflection-2310.11511.pdf`

Build/inspect:

- Inspect `repos/mlfoundations__dclm`.
- Inspect the DCLM CORE references in `repos/karpathy__nanochat`.
- Run the quick Parquet inspect from `data/README.md` on TMax-15K.

Exit artifact:

- `notes/03-data.md`: summarize filtering, deduplication, benchmark contamination, dataset mixing, and why DCLM-style controlled data experiments matter.

## Phase 4: Fine-Tuning And Preference Optimization

Time: 1-2 weeks.

Goal: understand the post-training methods before touching agent RL.

Read:

- `papers/01-llm-foundations/lora-low-rank-adaptation-of-large-language-models-2106.09685.pdf`
- `papers/01-llm-foundations/qlora-efficient-finetuning-of-quantized-llms-2305.14314.pdf`
- `papers/02-post-training-rl/training-language-models-to-follow-instructions-with-human-feedback-2203.02155.pdf`
- `papers/02-post-training-rl/direct-preference-optimization-your-language-model-is-secretly-a-reward-model-2305.18290.pdf`
- `papers/02-post-training-rl/constitutional-ai-harmlessness-from-ai-feedback-2212.08073.pdf`
- `papers/02-post-training-rl/rlaif-vs-rlhf-scaling-reinforcement-learning-from-human-feedback-with-ai-feedback-2309.00267.pdf`
- Optional: `papers/02-post-training-rl/kto-model-alignment-as-prospect-theoretic-optimization-2402.01306.pdf`, `papers/02-post-training-rl/orpo-monolithic-preference-optimization-without-reference-model-2403.07691.pdf`, `papers/02-post-training-rl/simpo-simple-preference-optimization-with-a-reference-free-reward-2405.14734.pdf`

Build/inspect:

- Inspect `repos/huggingface__trl`.
- Inspect `repos/allenai__open-instruct`.
- Inspect `repos/hamishivi__tmax/training/open-instruct/` to see the fork TMax actually used.

Exit artifact:

- `notes/04-post-training.md`: compare SFT, reward-model RLHF, DPO, KTO, ORPO, SimPO, RLAIF. For each: data needed, objective shape, what can go wrong, when you would use it.

## Phase 5: Open Post-Training Stacks

Time: 1 week.

Goal: map papers to code you could actually run.

Read:

- `papers/02-post-training-rl/tulu-3-pushing-frontiers-in-open-language-model-post-training-2411.15124.pdf`
- `papers/08-post-training-stack/openrlhf-an-easy-to-use-scalable-and-high-performance-rlhf-framework-2405.11143.pdf`
- `papers/08-post-training-stack/hybridflow-a-flexible-and-efficient-rlhf-framework-2409.19256.pdf`
- `papers/02-post-training-rl/rewardbench-evaluating-reward-models-for-language-modeling-2403.13787.pdf`

Build/inspect:

- Inspect `repos/allenai__open-instruct/scripts/`.
- Inspect `repos/OpenRLHF__OpenRLHF`.
- Inspect `repos/volcengine__verl`.
- Inspect `repos/allenai__reward-bench`.

Exit artifact:

- `notes/05-post-training-stacks.md`: pick one stack for local/small experiments and one stack for future multi-GPU RL. Explain why.

## Phase 6: RL For Reasoning And Verifiable Rewards

Time: 1-2 weeks.

Goal: understand why verifier-backed RL is different from preference-only optimization.

Read:

- `papers/02-post-training-rl/proximal-policy-optimization-algorithms-1707.06347.pdf`
- `papers/02-post-training-rl/deepseekmath-pushing-the-limits-of-mathematical-reasoning-in-open-language-models-2402.03300.pdf`
- `papers/02-post-training-rl/deepseek-r1-incentivizing-reasoning-capability-in-llms-via-reinforcement-learning-2501.12948.pdf`
- `papers/02-post-training-rl/lets-verify-step-by-step-2305.20050.pdf`
- `papers/03-reasoning-and-agents/arc-prize-2024-technical-report-2412.04604.pdf`
- `papers/03-reasoning-and-agents/recursive-language-models-2512.24601.pdf`

Build:

- Implement a toy verifier task: arithmetic or file-edit task with exact pass/fail reward.
- Log rollouts, reward, command count, length, and failure reason.

Exit artifact:

- `notes/06-rlvr.md`: explain PPO vs GRPO, outcome vs process rewards, all-zero/all-one batches, reward hacking, pass@k, and why longer rollouts can help or hurt.

## Phase 7: Agents, Tools, And Software Benchmarks

Time: 1 week.

Goal: understand the harness before optimizing the model.

Read:

- `papers/03-reasoning-and-agents/chain-of-thought-prompting-elicits-reasoning-in-large-language-models-2201.11903.pdf`
- `papers/03-reasoning-and-agents/react-synergizing-reasoning-and-acting-in-language-models-2210.03629.pdf`
- `papers/03-reasoning-and-agents/toolformer-language-models-can-teach-themselves-to-use-tools-2302.04761.pdf`
- `papers/03-reasoning-and-agents/swe-agent-agent-computer-interfaces-enable-automated-software-engineering-2405.15793.pdf`
- `papers/03-reasoning-and-agents/openhands-an-open-platform-for-ai-software-developers-as-generalist-agents-2407.16741.pdf`
- `papers/04-evaluation/swe-bench-can-language-models-resolve-real-world-github-issues-2310.06770.pdf`

Build/inspect:

- Inspect `repos/SWE-agent__mini-swe-agent`.
- Build a tiny terminal harness: prompt, shell executor, transcript logger, timeout, verifier, scalar reward.

Exit artifact:

- `notes/07-agent-harness.md`: diagram model vs agent harness vs environment vs evaluator. Include what state is visible to the model and what is hidden in the verifier.

## Phase 8: Terminal-Agent RL And TMax

Time: 2 weeks.

Goal: understand the paper that triggered this project deeply enough to reproduce a slice.

Read:

- `papers/03-reasoning-and-agents/terminal-bench-benchmarking-agents-on-hard-realistic-tasks-in-command-line-interfaces-2601.11868.pdf`
- `papers/03-reasoning-and-agents/terminaltraj-large-scale-terminal-agentic-trajectory-generation-from-dockerized-environments-2602.01244.pdf`
- `papers/03-reasoning-and-agents/termigen-high-fidelity-environment-and-robust-trajectory-synthesis-for-terminal-agents-2602.07274.pdf`
- `papers/03-reasoning-and-agents/terminal-world-scaling-terminal-agent-environments-via-agent-skills-2605.20876.pdf`
- `papers/03-reasoning-and-agents/cli-universe-towards-verifiable-task-synthesis-engine-for-terminal-agents-2606.22883.pdf`
- `papers/03-reasoning-and-agents/tmax-a-simple-recipe-for-terminal-agents-2606.23321.pdf`

Build/inspect:

- Inspect `repos/harbor-framework__terminal-bench`.
- Inspect `repos/hamishivi__tmax/README.md`.
- Inspect `repos/hamishivi__tmax/rl_data/` and `training/open-instruct/scripts/tmax/`.
- Profile `data/tmax/TMax-15K/train-0000.parquet`: domains, skills, languages, verifier types, container complexity.

Exit artifact:

- `notes/08-tmax.md`: explain TMax's dataset axes, soft filtering, verifier format, open-instruct/DPPO setup, stability fixes, group size, output length, and what reproduction slice you will attempt.

## Phase 9: Evaluation Rigor, Security, And Sandboxing

Time: 1 week.

Goal: avoid fooling yourself or running unsafe terminal agents.

Read:

- `papers/09-agent-evaluation-security/agentbench-evaluating-llms-as-agents-2308.03688.pdf`
- `papers/09-agent-evaluation-security/swe-bench-goes-live-2505.23419.pdf`
- `papers/09-agent-evaluation-security/sandboxeval-towards-securing-test-environment-for-untrusted-code-2504.00018.pdf`
- `papers/09-agent-evaluation-security/prompt-injection-attack-to-tool-selection-in-llm-agents-2504.19793.pdf`
- `resources/README.md` security links.

Build/inspect:

- Inspect `repos/THUDM__AgentBench`.
- Inspect `repos/microsoft__SWE-bench-Live`.
- Write a sandbox checklist for your toy terminal harness.

Exit artifact:

- `notes/09-eval-security.md`: include contamination checks, leakage checks, reproducibility checklist, Docker/root/network rules, secret handling, prompt-injection defense, and verifier isolation.

## Phase 10: Systems, Serving, And Training Infra

Time: 1 week.

Goal: understand the infra constraints that determine what experiments are feasible.

Read:

- `papers/05-systems-inference/flashattention-fast-and-memory-efficient-exact-attention-with-io-awareness-2205.14135.pdf`
- `papers/05-systems-inference/efficient-memory-management-for-large-language-model-serving-with-pagedattention-2309.06180.pdf`
- `papers/05-systems-inference/fast-inference-from-transformers-via-speculative-decoding-2211.17192.pdf`
- `papers/05-systems-inference/accelerating-large-language-model-decoding-with-speculative-sampling-2302.01318.pdf`
- `papers/05-systems-inference/dspark-confidence-scheduled-speculative-decoding-with-semi-autoregressive-generation.pdf`
- Optional: `papers/05-systems-inference/zero-memory-optimizations-toward-training-trillion-parameter-models-1910.02054.pdf`, `papers/05-systems-inference/megatron-lm-training-multi-billion-parameter-language-models-using-model-parallelism-1909.08053.pdf`

Build/inspect:

- Inspect `repos/vllm-project__vllm`.
- Inspect `repos/deepseek-ai__DeepSpec`.
- Inspect how `verl` and `OpenRLHF` handle rollout generation and training workers.

Exit artifact:

- `notes/10-systems.md`: define KV cache, batching, speculative decoding, ZeRO/FSDP-style sharding, checkpointing, rollout worker, trainer worker, and why long terminal-agent rollouts are expensive.

## Phase 11: Interpretability And Debugging Optional Track

Time: 3-5 days, optional but useful.

Goal: know the basic tools for inspecting model internals and failure modes.

Read:

- `papers/10-interpretability/a-practical-review-of-mechanistic-interpretability-for-transformer-based-language-models-2407.02646.pdf`

Build/inspect:

- Inspect `repos/TransformerLensOrg__TransformerLens`.
- Inspect `repos/jbloomAus__SAELens`.

Exit artifact:

- `notes/11-interpretability.md`: explain activations, circuits, probes, sparse autoencoders, and one way this could help debug a terminal agent.

## Phase 12: First Real Contribution Loop

Time: 1-2 weeks.

Goal: produce a real artifact, not just notes.

Pick one:

- TMax dataset profiling notebook plus written findings.
- Tiny terminal-agent harness with 20 tasks and failure-mode report.
- Toy GRPO/RLVR loop on verifier-backed terminal tasks.
- Reproduce one TMax/open-instruct launch path at debug scale.
- Clear issue or PR to `tmax`, `open-instruct`, `terminal-bench`, `mini-swe-agent`, `verl`, or `reward-bench` based on a concrete reproducibility gap.

Exit artifact:

- `notes/12-contribution.md`: hypothesis, setup, commands, results, failure modes, and next experiment.

## Compression Paths

If you have 2 weeks:

1. Phase 0.
2. Phase 1 with nanoGPT.
3. Phase 4 summary only.
4. Phase 8 TMax deep read.
5. One small Phase 12 artifact.

If you have 6 weeks:

1. Phase 0-2.
2. Phase 4-6.
3. Phase 8-9.
4. Phase 12.

If your only goal is terminal-agent RL:

1. Phase 0.
2. Phase 4-6.
3. Phase 7-9.
4. Phase 10 only as needed for running experiments.
