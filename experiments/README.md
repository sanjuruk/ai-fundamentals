# Experiments

Use this as the practical ladder. Each experiment should produce a short note in `notes/` with setup, result, and next step.

## 01 NanoGPT Baseline

Goal: feel the mechanics of pretraining.

Run the smallest Shakespeare setup from `repos/karpathy__nanoGPT`.

Questions:

- Where is attention implemented?
- What is the loss?
- What changes when context length, layer count, or embedding size changes?

## 02 Nanochat Pipeline Read

Goal: understand a compact end-to-end assistant pipeline.

Inspect:

- `repos/karpathy__nanochat/runs/speedrun.sh`
- `repos/karpathy__nanochat/nanochat/`

Output:

- A stage diagram covering data, pretraining, midtraining, SFT, eval, and serving.

## 03 TMax Data Profile

Goal: understand what terminal-agent RL tasks look like.

Use:

- `data/tmax/TMax-15K/train-0000.parquet`
- `resources/raw/hf-tmax-15k-first-rows.json`

Questions:

- Which domains dominate?
- How often are tasks code-heavy versus data-heavy?
- What verifier patterns appear in `test_final_state`?
- How complex are the generated Docker/container definitions?

## 04 Toy Terminal Harness

Goal: build the minimal terminal-agent environment.

Components:

- Task prompt.
- Shell executor.
- Transcript logger.
- Timeout.
- Initial-state test.
- Final-state verifier.
- Scalar reward.

Do not train yet. First make 5 hand-written tasks pass/fail cleanly.

## 05 SFT Or Preference Toy Run

Goal: make post-training concrete.

Options:

- SFT a tiny model on successful toy traces.
- DPO on preference pairs from failed/successful traces.
- Compare behavior before and after.

## 06 Tiny RL Loop

Goal: reproduce the shape of a terminal-agent RL loop at toy scale.

Loop:

1. Sample task.
2. Generate action/command sequence.
3. Execute in sandbox.
4. Run verifier.
5. Log reward and transcript.
6. Update policy or simulate update with a smaller proxy objective.

Track:

- Reward distribution.
- Failure modes.
- Length/command count.
- All-zero/all-one task batches.

## 07 TMax Reproduction Slice

Goal: reproduce one small, source-backed part of TMax.

Possible slices:

- Dataset profiling notebook.
- Open-instruct data formatting check.
- Evaluation harness dry run on a small model.
- A single synthetic terminal task generator.
- A stability experiment around group size on toy tasks.
