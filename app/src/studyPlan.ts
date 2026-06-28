export type ResourceKind = 'paper' | 'video' | 'repo' | 'doc' | 'dataset' | 'site'

export type StudyResource = {
  id: string
  kind: ResourceKind
  title: string
  source?: string
  url?: string
  embedUrl?: string
  optional?: boolean
}

export type CheckItem = {
  id: string
  label: string
}

export type Phase = {
  id: string
  number: number
  title: string
  time: string
  goal: string
  emphasis: string
  resources: StudyResource[]
  inspect: CheckItem[]
  exitArtifact: CheckItem
  optional?: boolean
}

const arxivPdf = (source: string) => {
  const match = source.match(/-(\d{4}\.\d{4,5})\.pdf$/)
  return match ? `https://arxiv.org/pdf/${match[1]}` : undefined
}

const paper = (
  source: string,
  title: string,
  optional = false,
  url = arxivPdf(source),
): StudyResource => ({
  id: source,
  kind: 'paper',
  title,
  source,
  url,
  embedUrl: url,
  optional,
})

const repo = (source: string, title: string, url: string): StudyResource => ({
  id: source,
  kind: 'repo',
  title,
  source,
  url,
})

const doc = (source: string, title: string, url?: string): StudyResource => ({
  id: source,
  kind: 'doc',
  title,
  source,
  url,
})

const video = (
  id: string,
  title: string,
  url: string,
  embedUrl?: string,
): StudyResource => ({
  id,
  kind: 'video',
  title,
  url,
  embedUrl,
})

const site = (id: string, title: string, url: string): StudyResource => ({
  id,
  kind: 'site',
  title,
  url,
})

const dataset = (id: string, title: string, url: string): StudyResource => ({
  id,
  kind: 'dataset',
  title,
  url,
})

export const phases: Phase[] = [
  {
    id: 'p0',
    number: 0,
    title: 'Orientation And Vocabulary',
    time: '2-3 days',
    emphasis: 'Get the field into a usable map.',
    goal: 'Stop the field from feeling like a bag of unrelated acronyms.',
    resources: [
      doc(
        'resources/raw/ai-crash-course-readme.md',
        'Henry Shi AI Crash Course README snapshot',
        'https://github.com/henrythe9th/AI-Crash-Course/blob/main/README.md',
      ),
      paper(
        'papers/00-surveys/foundations-of-large-language-models-2501.09223.pdf',
        'Foundations of Large Language Models',
      ),
      paper('papers/00-surveys/large-language-models-a-survey-2402.06196.pdf', 'A Survey of Large Language Models'),
      paper('papers/00-surveys/a-survey-on-large-language-model-based-autonomous-agents-2308.11432.pdf', 'A Survey on Large Language Model based Autonomous Agents'),
      video(
        'video-3b1b-neural-llm',
        '3Blue1Brown neural-network-to-LLM sequence',
        'https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
        'https://www.youtube.com/embed/aircAruvnKk?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
      ),
    ],
    inspect: [{ id: 'p0-top-level-readmes', label: 'Skim every top-level README in repos/' }],
    exitArtifact: {
      id: 'p0-exit-vocabulary',
      label:
        'Write notes/00-vocabulary.md with the required term definitions.',
    },
  },
  {
    id: 'p1',
    number: 1,
    title: 'Transformers And Pretraining Basics',
    time: '1 week',
    emphasis: 'Trace the core training loop.',
    goal: 'Understand the core training loop and model shape.',
    resources: [
      paper('papers/01-llm-foundations/attention-is-all-you-need-1706.03762.pdf', 'Attention Is All You Need'),
      paper('papers/01-llm-foundations/scaling-laws-for-neural-language-models-2001.08361.pdf', 'Scaling Laws for Neural Language Models'),
      paper('papers/01-llm-foundations/language-models-are-few-shot-learners-2005.14165.pdf', 'Language Models are Few-Shot Learners'),
      paper('papers/01-llm-foundations/training-compute-optimal-large-language-models-2203.15556.pdf', 'Training Compute-Optimal Large Language Models'),
    ],
    inspect: [
      { id: 'p1-run-nanogpt-shakespeare', label: 'Run the smallest Shakespeare path in nanoGPT.' },
      { id: 'p1-trace-nanogpt-code', label: 'Trace repos/karpathy__nanoGPT/model.py and train.py.' },
    ],
    exitArtifact: {
      id: 'p1-exit-nanogpt',
      label: 'Write notes/01-nanogpt.md explaining the model, training loop, and run result.',
    },
  },
  {
    id: 'p2',
    number: 2,
    title: 'Modern Open Model Recipes',
    time: '1 week',
    emphasis: 'Move from toy pretraining to real model recipes.',
    goal: 'Understand how real open models differ from toy pretraining.',
    resources: [
      paper('papers/01-llm-foundations/the-llama-3-herd-of-models-2407.21783.pdf', 'The Llama 3 Herd of Models'),
      paper('papers/01-llm-foundations/deepseek-v3-technical-report-2412.19437.pdf', 'DeepSeek-V3 Technical Report'),
      paper('papers/01-llm-foundations/gemini-1-5-unlocking-multimodal-understanding-across-millions-of-tokens-of-context-2403.05530.pdf', 'Gemini 1.5 Technical Report'),
      paper('papers/01-llm-foundations/mixtral-of-experts-2401.04088.pdf', 'Mixtral of Experts'),
    ],
    inspect: [
      { id: 'p2-inspect-speedrun', label: 'Inspect repos/karpathy__nanochat/runs/speedrun.sh.' },
      { id: 'p2-inspect-nanochat', label: 'Inspect repos/karpathy__nanochat/nanochat/.' },
    ],
    exitArtifact: {
      id: 'p2-exit-modern-recipes',
      label:
        'Write notes/02-modern-recipes.md with the raw-data-to-serving pipeline and feasibility notes.',
    },
  },
  {
    id: 'p3',
    number: 3,
    title: 'Data, Tokenization, And Contamination',
    time: '1 week',
    emphasis: 'Treat data quality as model quality.',
    goal: 'Understand that model quality is often data quality.',
    resources: [
      paper('papers/07-data-and-pretraining/datacomp-lm-in-search-of-the-next-generation-of-training-sets-for-language-models-2406.11794.pdf', 'DCLM: DataComp for Language Models'),
      paper('papers/07-data-and-pretraining/the-fineweb-datasets-decanting-the-web-for-the-finest-text-data-at-scale-2406.17557.pdf', 'The FineWeb Datasets'),
      paper('papers/00-surveys/a-survey-of-context-engineering-for-large-language-models-2507.13334.pdf', 'A Survey of Context Engineering for LLMs'),
      paper('papers/03-reasoning-and-agents/retrieval-augmented-generation-for-knowledge-intensive-nlp-tasks-2005.11401.pdf', 'Retrieval-Augmented Generation for Knowledge-Intensive NLP'),
      paper('papers/03-reasoning-and-agents/self-rag-learning-to-retrieve-generate-and-critique-through-self-reflection-2310.11511.pdf', 'Self-RAG', true),
    ],
    inspect: [
      { id: 'p3-inspect-dclm', label: 'Inspect repos/mlfoundations__dclm.' },
      { id: 'p3-inspect-dclm-core', label: 'Inspect DCLM CORE references in nanochat.' },
      { id: 'p3-run-parquet-inspect', label: 'Run the quick Parquet inspect from data/README.md on TMax-15K.' },
    ],
    exitArtifact: {
      id: 'p3-exit-data',
      label: 'Write notes/03-data.md on filtering, deduplication, contamination, mixing, and DCLM-style experiments.',
    },
  },
  {
    id: 'p4',
    number: 4,
    title: 'Fine-Tuning And Preference Optimization',
    time: '1-2 weeks',
    emphasis: 'Separate SFT, preference learning, and RL.',
    goal: 'Understand the post-training methods before touching agent RL.',
    resources: [
      paper('papers/01-llm-foundations/lora-low-rank-adaptation-of-large-language-models-2106.09685.pdf', 'LoRA: Low-Rank Adaptation'),
      paper('papers/01-llm-foundations/qlora-efficient-finetuning-of-quantized-llms-2305.14314.pdf', 'QLoRA'),
      paper('papers/02-post-training-rl/training-language-models-to-follow-instructions-with-human-feedback-2203.02155.pdf', 'Training language models to follow instructions with human feedback'),
      paper('papers/02-post-training-rl/direct-preference-optimization-your-language-model-is-secretly-a-reward-model-2305.18290.pdf', 'Direct Preference Optimization'),
      paper('papers/02-post-training-rl/constitutional-ai-harmlessness-from-ai-feedback-2212.08073.pdf', 'Constitutional AI'),
      paper('papers/02-post-training-rl/rlaif-vs-rlhf-scaling-reinforcement-learning-from-human-feedback-with-ai-feedback-2309.00267.pdf', 'RLAIF: Scaling Reinforcement Learning from AI Feedback'),
      paper('papers/02-post-training-rl/kto-model-alignment-as-prospect-theoretic-optimization-2402.01306.pdf', 'KTO', true),
      paper('papers/02-post-training-rl/orpo-monolithic-preference-optimization-without-reference-model-2403.07691.pdf', 'ORPO', true),
      paper('papers/02-post-training-rl/simpo-simple-preference-optimization-with-a-reference-free-reward-2405.14734.pdf', 'SimPO', true),
    ],
    inspect: [
      { id: 'p4-inspect-trl', label: 'Inspect repos/huggingface__trl.' },
      { id: 'p4-inspect-open-instruct', label: 'Inspect repos/allenai__open-instruct.' },
      { id: 'p4-inspect-tmax-fork', label: 'Inspect repos/hamishivi__tmax/training/open-instruct/.' },
    ],
    exitArtifact: {
      id: 'p4-exit-post-training',
      label:
        'Write notes/04-post-training.md comparing SFT, RLHF, DPO, KTO, ORPO, SimPO, and RLAIF.',
    },
  },
  {
    id: 'p5',
    number: 5,
    title: 'Open Post-Training Stacks',
    time: '1 week',
    emphasis: 'Map papers to code you can run.',
    goal: 'Map papers to code you could actually run.',
    resources: [
      paper('papers/02-post-training-rl/tulu-3-pushing-frontiers-in-open-language-model-post-training-2411.15124.pdf', 'Tulu 3: Pushing Frontiers in Open Language Model Post-Training'),
      paper('papers/08-post-training-stack/openrlhf-an-easy-to-use-scalable-and-high-performance-rlhf-framework-2405.11143.pdf', 'OpenRLHF'),
      paper('papers/08-post-training-stack/hybridflow-a-flexible-and-efficient-rlhf-framework-2409.19256.pdf', 'HybridFlow / verl'),
      paper('papers/02-post-training-rl/rewardbench-evaluating-reward-models-for-language-modeling-2403.13787.pdf', 'RewardBench'),
    ],
    inspect: [
      { id: 'p5-inspect-open-instruct-scripts', label: 'Inspect repos/allenai__open-instruct/scripts/.' },
      { id: 'p5-inspect-openrlhf', label: 'Inspect repos/OpenRLHF__OpenRLHF.' },
      { id: 'p5-inspect-verl', label: 'Inspect repos/volcengine__verl.' },
      { id: 'p5-inspect-reward-bench', label: 'Inspect repos/allenai__reward-bench.' },
    ],
    exitArtifact: {
      id: 'p5-exit-stack-choice',
      label: 'Write notes/05-post-training-stacks.md choosing one local stack and one future multi-GPU RL stack.',
    },
  },
  {
    id: 'p6',
    number: 6,
    title: 'RL For Reasoning And Verifiable Rewards',
    time: '1-2 weeks',
    emphasis: 'Use exact rewards before agent complexity.',
    goal: 'Understand why verifier-backed RL is different from preference-only optimization.',
    resources: [
      paper('papers/02-post-training-rl/proximal-policy-optimization-algorithms-1707.06347.pdf', 'Proximal Policy Optimization Algorithms'),
      paper('papers/02-post-training-rl/deepseekmath-pushing-the-limits-of-mathematical-reasoning-in-open-language-models-2402.03300.pdf', 'DeepSeekMath and GRPO'),
      paper('papers/02-post-training-rl/deepseek-r1-incentivizing-reasoning-capability-in-llms-via-reinforcement-learning-2501.12948.pdf', 'DeepSeek-R1'),
      paper('papers/02-post-training-rl/lets-verify-step-by-step-2305.20050.pdf', 'Let us Verify Step by Step'),
      paper('papers/03-reasoning-and-agents/arc-prize-2024-technical-report-2412.04604.pdf', 'ARC Prize'),
      paper('papers/03-reasoning-and-agents/recursive-language-models-2512.24601.pdf', 'Recursive Language Models'),
    ],
    inspect: [
      { id: 'p6-build-toy-verifier', label: 'Implement a toy arithmetic or file-edit verifier task with exact pass/fail reward.' },
      { id: 'p6-log-rollouts', label: 'Log rollouts, reward, command count, length, and failure reason.' },
    ],
    exitArtifact: {
      id: 'p6-exit-rlvr',
      label:
        'Write notes/06-rlvr.md on PPO vs GRPO, reward shape, all-zero/all-one batches, reward hacking, pass@k, and rollout length.',
    },
  },
  {
    id: 'p7',
    number: 7,
    title: 'Agents, Tools, And Software Benchmarks',
    time: '1 week',
    emphasis: 'Understand the harness before optimizing models.',
    goal: 'Understand the harness before optimizing the model.',
    resources: [
      paper('papers/03-reasoning-and-agents/chain-of-thought-prompting-elicits-reasoning-in-large-language-models-2201.11903.pdf', 'Chain-of-Thought Prompting'),
      paper('papers/03-reasoning-and-agents/react-synergizing-reasoning-and-acting-in-language-models-2210.03629.pdf', 'ReAct'),
      paper('papers/03-reasoning-and-agents/toolformer-language-models-can-teach-themselves-to-use-tools-2302.04761.pdf', 'Toolformer'),
      paper('papers/03-reasoning-and-agents/swe-agent-agent-computer-interfaces-enable-automated-software-engineering-2405.15793.pdf', 'SWE-agent'),
      paper('papers/03-reasoning-and-agents/openhands-an-open-platform-for-ai-software-developers-as-generalist-agents-2407.16741.pdf', 'OpenHands'),
      paper('papers/04-evaluation/swe-bench-can-language-models-resolve-real-world-github-issues-2310.06770.pdf', 'SWE-bench'),
    ],
    inspect: [
      { id: 'p7-inspect-mini-swe-agent', label: 'Inspect repos/SWE-agent__mini-swe-agent.' },
      { id: 'p7-build-harness', label: 'Build a tiny terminal harness with prompt, shell executor, transcript logger, timeout, verifier, and scalar reward.' },
    ],
    exitArtifact: {
      id: 'p7-exit-agent-harness',
      label:
        'Write notes/07-agent-harness.md diagramming model, harness, environment, evaluator, visible state, and hidden verifier state.',
    },
  },
  {
    id: 'p8',
    number: 8,
    title: 'Terminal-Agent RL And TMax',
    time: '2 weeks',
    emphasis: 'Deep read the project anchor.',
    goal: 'Understand the paper that triggered this project deeply enough to reproduce a slice.',
    resources: [
      paper('papers/03-reasoning-and-agents/terminal-bench-benchmarking-agents-on-hard-realistic-tasks-in-command-line-interfaces-2601.11868.pdf', 'Terminal-Bench'),
      paper('papers/03-reasoning-and-agents/terminaltraj-large-scale-terminal-agentic-trajectory-generation-from-dockerized-environments-2602.01244.pdf', 'TerminalTraj'),
      paper('papers/03-reasoning-and-agents/termigen-high-fidelity-environment-and-robust-trajectory-synthesis-for-terminal-agents-2602.07274.pdf', 'TermiGen'),
      paper('papers/03-reasoning-and-agents/terminal-world-scaling-terminal-agent-environments-via-agent-skills-2605.20876.pdf', 'Terminal-World'),
      paper('papers/03-reasoning-and-agents/cli-universe-towards-verifiable-task-synthesis-engine-for-terminal-agents-2606.22883.pdf', 'CLI Universe'),
      paper('papers/03-reasoning-and-agents/tmax-a-simple-recipe-for-terminal-agents-2606.23321.pdf', 'TMax: A Simple Recipe for Training Terminal Agents'),
    ],
    inspect: [
      { id: 'p8-inspect-terminal-bench', label: 'Inspect repos/harbor-framework__terminal-bench.' },
      { id: 'p8-inspect-tmax-readme', label: 'Inspect repos/hamishivi__tmax/README.md.' },
      { id: 'p8-inspect-tmax-rl-data', label: 'Inspect repos/hamishivi__tmax/rl_data/ and training/open-instruct/scripts/tmax/.' },
      { id: 'p8-profile-tmax-15k', label: 'Profile TMax-15K domains, skills, languages, verifier types, and container complexity.' },
    ],
    exitArtifact: {
      id: 'p8-exit-tmax',
      label:
        'Write notes/08-tmax.md explaining dataset axes, filtering, verifier format, DPPO setup, stability fixes, group size, output length, and reproduction slice.',
    },
  },
  {
    id: 'p9',
    number: 9,
    title: 'Evaluation Rigor, Security, And Sandboxing',
    time: '1 week',
    emphasis: 'Avoid fooling yourself or running unsafe agents.',
    goal: 'Avoid fooling yourself or running unsafe terminal agents.',
    resources: [
      paper('papers/09-agent-evaluation-security/agentbench-evaluating-llms-as-agents-2308.03688.pdf', 'AgentBench'),
      paper('papers/09-agent-evaluation-security/swe-bench-goes-live-2505.23419.pdf', 'SWE-bench Live'),
      paper('papers/09-agent-evaluation-security/sandboxeval-towards-securing-test-environment-for-untrusted-code-2504.00018.pdf', 'SandboxEval'),
      paper('papers/09-agent-evaluation-security/prompt-injection-attack-to-tool-selection-in-llm-agents-2504.19793.pdf', 'Prompt Injection in Tool Selection'),
      doc('resources/README.md', 'Security links from resources/README.md'),
    ],
    inspect: [
      { id: 'p9-inspect-agentbench', label: 'Inspect repos/THUDM__AgentBench.' },
      { id: 'p9-inspect-swe-bench-live', label: 'Inspect repos/microsoft__SWE-bench-Live.' },
      { id: 'p9-write-sandbox-checklist', label: 'Write a sandbox checklist for the toy terminal harness.' },
    ],
    exitArtifact: {
      id: 'p9-exit-eval-security',
      label:
        'Write notes/09-eval-security.md with contamination, leakage, reproducibility, Docker, secret, injection, and verifier-isolation checks.',
    },
  },
  {
    id: 'p10',
    number: 10,
    title: 'Systems, Serving, And Training Infra',
    time: '1 week',
    emphasis: 'Learn the constraints that decide feasibility.',
    goal: 'Understand the infra constraints that determine what experiments are feasible.',
    resources: [
      paper('papers/05-systems-inference/flashattention-fast-and-memory-efficient-exact-attention-with-io-awareness-2205.14135.pdf', 'FlashAttention'),
      paper('papers/05-systems-inference/efficient-memory-management-for-large-language-model-serving-with-pagedattention-2309.06180.pdf', 'vLLM / PagedAttention'),
      paper('papers/05-systems-inference/fast-inference-from-transformers-via-speculative-decoding-2211.17192.pdf', 'Fast Inference from Transformers via Speculative Decoding'),
      paper('papers/05-systems-inference/accelerating-large-language-model-decoding-with-speculative-sampling-2302.01318.pdf', 'Accelerating Large Language Model Decoding with Speculative Sampling'),
      {
        id: 'papers/05-systems-inference/dspark-confidence-scheduled-speculative-decoding-with-semi-autoregressive-generation.pdf',
        kind: 'paper',
        title: 'DSpark: Confidence-Scheduled Speculative Decoding',
        source: 'papers/05-systems-inference/dspark-confidence-scheduled-speculative-decoding-with-semi-autoregressive-generation.pdf',
        url: 'https://github.com/deepseek-ai/DeepSpec/blob/main/DSpark_paper.pdf',
      },
      paper('papers/05-systems-inference/zero-memory-optimizations-toward-training-trillion-parameter-models-1910.02054.pdf', 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models', true),
      paper('papers/05-systems-inference/megatron-lm-training-multi-billion-parameter-language-models-using-model-parallelism-1909.08053.pdf', 'Megatron-LM', true),
    ],
    inspect: [
      { id: 'p10-inspect-vllm', label: 'Inspect repos/vllm-project__vllm.' },
      { id: 'p10-inspect-deepspec', label: 'Inspect repos/deepseek-ai__DeepSpec.' },
      { id: 'p10-inspect-workers', label: 'Inspect how verl and OpenRLHF handle rollout generation and training workers.' },
    ],
    exitArtifact: {
      id: 'p10-exit-systems',
      label:
        'Write notes/10-systems.md defining KV cache, batching, speculative decoding, sharding, checkpointing, rollout workers, trainer workers, and terminal-agent rollout costs.',
    },
  },
  {
    id: 'p11',
    number: 11,
    title: 'Interpretability And Debugging Optional Track',
    time: '3-5 days',
    emphasis: 'Optional tools for inspecting model internals.',
    goal: 'Know the basic tools for inspecting model internals and failure modes.',
    optional: true,
    resources: [
      paper('papers/10-interpretability/a-practical-review-of-mechanistic-interpretability-for-transformer-based-language-models-2407.02646.pdf', 'A Survey of Mechanistic Interpretability'),
    ],
    inspect: [
      { id: 'p11-inspect-transformerlens', label: 'Inspect repos/TransformerLensOrg__TransformerLens.' },
      { id: 'p11-inspect-saelens', label: 'Inspect repos/jbloomAus__SAELens.' },
    ],
    exitArtifact: {
      id: 'p11-exit-interpretability',
      label:
        'Write notes/11-interpretability.md explaining activations, circuits, probes, sparse autoencoders, and one terminal-agent debugging use.',
    },
  },
  {
    id: 'p12',
    number: 12,
    title: 'First Real Contribution Loop',
    time: '1-2 weeks',
    emphasis: 'Produce a real artifact.',
    goal: 'Produce a real artifact, not just notes.',
    resources: [
      repo('repos/hamishivi__tmax/README.md', 'TMax codebase', 'https://github.com/hamishivi/tmax'),
      repo('repos/allenai__open-instruct/README.md', 'Open Instruct', 'https://github.com/allenai/open-instruct'),
      repo('repos/harbor-framework__terminal-bench/README.md', 'Terminal-Bench', 'https://github.com/harbor-framework/terminal-bench'),
      repo('repos/SWE-agent__mini-swe-agent/README.md', 'mini-swe-agent', 'https://github.com/SWE-agent/mini-swe-agent'),
      repo('repos/volcengine__verl/README.md', 'verl', 'https://github.com/volcengine/verl'),
      repo('repos/allenai__reward-bench/README.md', 'RewardBench', 'https://github.com/allenai/reward-bench'),
    ],
    inspect: [
      { id: 'p12-option-profile', label: 'Pick: TMax dataset profiling notebook plus findings.' },
      { id: 'p12-option-harness', label: 'Pick: tiny terminal-agent harness with 20 tasks and failure report.' },
      { id: 'p12-option-rlvr', label: 'Pick: toy GRPO/RLVR loop on verifier-backed terminal tasks.' },
      { id: 'p12-option-repro', label: 'Pick: reproduce one TMax/open-instruct launch path at debug scale.' },
      { id: 'p12-option-pr', label: 'Pick: issue or PR from a concrete reproducibility gap.' },
    ],
    exitArtifact: {
      id: 'p12-exit-contribution',
      label: 'Write notes/12-contribution.md with hypothesis, setup, commands, results, failure modes, and next experiment.',
    },
  },
]

export const referenceResources: StudyResource[] = [
  video(
    'video-karpathy-zero-to-hero',
    'Karpathy Zero to Hero',
    'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ',
    'https://www.youtube.com/embed/videoseries?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ',
  ),
  video(
    'video-karpathy-gpt',
    'Karpathy GPT video',
    'https://www.youtube.com/watch?v=kCc8FmEb1nY',
    'https://www.youtube.com/embed/kCc8FmEb1nY',
  ),
  video(
    'video-noam-brown-planning',
    'Noam Brown on planning in AI',
    'https://www.youtube.com/watch?v=eaAonE58sLU',
    'https://www.youtube.com/embed/eaAonE58sLU',
  ),
  video(
    'video-stanford-building-llms',
    'Stanford Building LLMs',
    'https://www.youtube.com/watch?v=9vM4p9NN0Ts',
    'https://www.youtube.com/embed/9vM4p9NN0Ts',
  ),
  site('site-yannic-kilcher', 'Yannic Kilcher paper explanations', 'https://www.youtube.com/@YannicKilcher'),
  site('site-fsdl', 'Full Stack Deep Learning', 'https://fullstackdeeplearning.com/'),
  site('site-prompting-guide', 'Prompting Guide', 'https://www.promptingguide.ai/'),
  site('site-ai-canon', 'a16z AI Canon', 'https://a16z.com/ai-canon/'),
  site('site-latent-space-2025', 'Latent Space 2025 AI Engineer reading list', 'https://www.latent.space/p/2025-papers'),
  site('site-state-generative-models-2024', 'State of Generative Models 2024', 'https://nrehiew.github.io/blog/2024/'),
  site('site-owasp-llm', 'OWASP Top 10 for LLM Applications', 'https://owasp.org/www-project-top-10-for-large-language-model-applications/'),
  site('site-docker-rootless', 'Docker rootless mode', 'https://docs.docker.com/engine/security/rootless/'),
  site('site-docker-seccomp', 'Docker seccomp profiles', 'https://docs.docker.com/engine/security/seccomp/'),
  site('site-docker-privilege', 'Docker runtime privilege and capabilities', 'https://docs.docker.com/engine/containers/run/#runtime-privilege-and-linux-capabilities'),
  paper('papers/03-reasoning-and-agents/tmax-a-simple-recipe-for-terminal-agents-2606.23321.pdf', 'TMax paper'),
  site('site-tmax-blog', 'TMax blog', 'https://wai-org.com/blog/tmax/'),
  repo('repos/hamishivi__tmax/README.md', 'TMax code', 'https://github.com/hamishivi/tmax'),
  dataset('dataset-tmax-hf-collection', 'TMax Hugging Face collection', 'https://huggingface.co/collections/allenai/tmax'),
  dataset('dataset-tmax-15k', 'TMax-15K dataset', 'https://huggingface.co/datasets/allenai/TMax-15K'),
  site('site-terminal-bench-leaderboard', 'Terminal Bench leaderboard', 'https://www.tbench.ai/leaderboard/terminal-bench/2.0'),
  site('site-terminal-bench', 'Terminal Bench site', 'https://www.tbench.ai/'),
]

export const compressionPaths = [
  {
    id: 'two-week',
    title: '2 week compression',
    phases: ['Phase 0', 'Phase 1 with nanoGPT', 'Phase 4 summary only', 'Phase 8 TMax deep read', 'One Phase 12 artifact'],
  },
  {
    id: 'six-week',
    title: '6 week route',
    phases: ['Phase 0-2', 'Phase 4-6', 'Phase 8-9', 'Phase 12'],
  },
  {
    id: 'terminal-agent',
    title: 'Terminal-agent RL only',
    phases: ['Phase 0', 'Phase 4-6', 'Phase 7-9', 'Phase 10 as needed'],
  },
]
