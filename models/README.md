# Models

Model weights were intentionally not downloaded. Pull them only when you know which experiment needs them and where the storage budget should go.

## TMax Models

From the Hugging Face collection `allenai/tmax`:

- `allenai/tmax-2b`
- `allenai/tmax-4b`
- `allenai/tmax-8b`
- `allenai/tmax-9b`
- `allenai/tmax-27b`
- `allenai/tmax-sft-8b`
- Ablation/comparison models: `qwen35-9b-endless`, `qwen35-9b-terminaltraj`, `qwen35-9b-termigen`, `qwen35-9b-swesmith`, `qwen35-9b-cli-gym`, `qwen35-9b-openthoughts`

Collection:

```text
https://huggingface.co/collections/allenai/tmax
```

## Download Commands

Install the Hugging Face CLI if needed:

```bash
curl -LsSf https://hf.co/cli/install.sh | bash -s
```

Metadata-only example:

```bash
hf download allenai/tmax-9b \
  --local-dir models/allenai__tmax-9b \
  --exclude "*.safetensors" "*.bin"
```

Weights example:

```bash
hf download allenai/tmax-9b \
  --local-dir models/allenai__tmax-9b
```

Expect multi-GB downloads for weights.
