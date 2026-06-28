# Repositories

This directory has the original GitHub star-list repos plus practical repos added for post-training, agent evaluation, terminal benchmarks, and interpretability. Clones are shallow/blobless where possible.

## Local Repos

| Local path | Upstream | Snapshot | Why it is here |
| --- | --- | --- | --- |
| `Engineer1999__A-Curated-List-of-ML-System-Design-Case-Studies` | https://github.com/Engineer1999/A-Curated-List-of-ML-System-Design-Case-Studies | `1da84a9`, 2025-08-05 | ML system design examples. |
| `henrythe9th__AI-Crash-Course` | https://github.com/henrythe9th/AI-Crash-Course | `6f53c9d`, 2026-02-23 | Broad crash-course backbone. |
| `karpathy__nanoGPT` | https://github.com/karpathy/nanoGPT | `3adf61e`, 2025-11-12 | Minimal GPT training loop. |
| `karpathy__nanochat` | https://github.com/karpathy/nanochat | `dc54a1a`, 2026-05-05 | Compact end-to-end LLM pipeline. |
| `mlfoundations__dclm` | https://github.com/mlfoundations/dclm | `361714b`, 2025-09-08 | Data curation and DCLM CORE eval. |
| `deepseek-ai__DeepSeek-R1` | https://github.com/deepseek-ai/DeepSeek-R1 | `0cf7856`, 2025-04-09 | Reasoning RL artifact. |
| `allenai__open-instruct` | https://github.com/allenai/open-instruct | `78d1e5a`, 2026-06-27 | Open post-training stack and TMax upstream base. |
| `huggingface__trl` | https://github.com/huggingface/trl | `b6c5ae1`, 2026-06-27 | Common SFT/DPO/RLHF training library. |
| `OpenRLHF__OpenRLHF` | https://github.com/OpenRLHF/OpenRLHF | `3f8ae08`, 2026-06-17 | RLHF/RLVR training stack. |
| `volcengine__verl` | https://github.com/volcengine/verl | `1ff76cc`, 2026-06-26 | HybridFlow/verl RL post-training stack. |
| `allenai__reward-bench` | https://github.com/allenai/reward-bench | `05a9005`, 2026-01-31 | Reward-model evaluation. |
| `SWE-agent__mini-swe-agent` | https://github.com/SWE-agent/mini-swe-agent | `d0e3c19`, 2026-06-22 | Small software-agent harness. |
| `THUDM__AgentBench` | https://github.com/THUDM/AgentBench | `d1e4a10`, 2026-02-09 | General agent benchmark. |
| `microsoft__SWE-bench-Live` | https://github.com/microsoft/SWE-bench-Live | `70ec57e`, 2026-06-11 | Live SWE-bench evaluation and contamination check. |
| `harbor-framework__terminal-bench` | https://github.com/harbor-framework/terminal-bench | `1a6ffa9`, 2026-01-21 | Terminal-Bench harness/tasks. |
| `hamishivi__tmax` | https://github.com/hamishivi/tmax | `1cce58a2`, 2026-06-26 | Main terminal-agent RL anchor. |
| `deepseek-ai__DeepSpec` | https://github.com/deepseek-ai/DeepSpec | `0a03e19`, 2026-06-27 | Speculative decoding training. |
| `vllm-project__vllm` | https://github.com/vllm-project/vllm | `c6741b2`, 2026-06-27 | Serving and inference systems. |
| `TransformerLensOrg__TransformerLens` | https://github.com/TransformerLensOrg/TransformerLens | `d0e3d8b`, 2026-06-18 | Mechanistic interpretability tooling. |
| `jbloomAus__SAELens` | https://github.com/jbloomAus/SAELens | `ccdfbe5`, 2026-06-24 | Sparse autoencoder interpretability tooling. |

## Suggested Reading Order

1. `henrythe9th__AI-Crash-Course/README.md`
2. `karpathy__nanoGPT/README.md`, then `model.py` and `train.py`
3. `karpathy__nanochat/README.md`, then `runs/speedrun.sh`
4. `mlfoundations__dclm/README.md`
5. `allenai__open-instruct/README.md`, `huggingface__trl/README.md`
6. `OpenRLHF__OpenRLHF/README.md`, `volcengine__verl/README.md`
7. `SWE-agent__mini-swe-agent/README.md`, `harbor-framework__terminal-bench/README.md`
8. `hamishivi__tmax/README.md`, `rl_data/`, and `training/open-instruct/scripts/tmax/`
9. `vllm-project__vllm/README.md`, `deepseek-ai__DeepSpec/README.md`
10. `TransformerLensOrg__TransformerLens/README.md`, `jbloomAus__SAELens/README.md`
