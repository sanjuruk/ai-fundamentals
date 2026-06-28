# Data

This directory currently focuses on the TMax Hugging Face release.

## Local Datasets

| Dataset | Local file(s) | Size |
| --- | --- | --- |
| `allenai/TMax-15K` | `tmax/TMax-15K/train-0000.parquet` | 58 MB |
| `allenai/tmax-15k-open-instruct` | `tmax/allenai__tmax-15k-open-instruct/default-train-0000.parquet` | 62 MB |
| `allenai/tmax-sft` | `tmax/allenai__tmax-sft/*.parquet` | 131 MB total |
| `allenai/TMax-SFT-16.5K` | `tmax/allenai__TMax-SFT-16.5K/default-train-0000.parquet` | 8.8 MB |
| `allenai/open-instruct-endless-terminals` | `tmax/allenai__open-instruct-endless-terminals/default-train-0000.parquet` | 3.6 MB |
| `allenai/open-instruct-terminal-traj` | `tmax/allenai__open-instruct-terminal-traj/default-train-0000.parquet` | 4.1 MB |
| `allenai/open-instruct-termigen` | `tmax/allenai__open-instruct-termigen/default-train-0000.parquet` | 5.1 MB |
| `allenai/open-instruct-swe-smith` | `tmax/allenai__open-instruct-swe-smith/default-train-0000.parquet` | 35 MB |
| `allenai/open-instruct-cli-gym` | `tmax/allenai__open-instruct-cli-gym/default-train-0000.parquet` | 1.3 MB |
| `allenai/open-instruct-openthoughts` | `tmax/allenai__open-instruct-openthoughts/default-train-0000.parquet` | 293 KB |

Not downloaded:

- `allenai/tmax-sft-big` - about 3.26 GB.
- Model weights - use `models/README.md`.

## TMax-15K Schema

The core `allenai/TMax-15K` dataset has 14,601 rows and these columns:

- `task_id`
- `domain`
- `skill_type`
- `primitive_skills`
- `task_complexity`
- `command_complexity`
- `scenario`
- `language`
- `description`
- `truth`
- `test_initial_state`
- `test_final_state`
- `container_def`

Raw HF API snapshots are in `resources/raw/`.

## Quick Inspect

No local Python dependencies:

```bash
npx -y -p parquetlens -p @parquetlens/sql parquetlens \
  data/tmax/TMax-15K/train-0000.parquet \
  --sql "SELECT task_id, domain, skill_type, language FROM data LIMIT 10"
```

Python path:

```bash
python3 -m pip install pandas pyarrow
```

```bash
python3 - <<'PY'
import pandas as pd

df = pd.read_parquet("data/tmax/TMax-15K/train-0000.parquet")
print(df.shape)
print(df[["task_id", "domain", "skill_type", "language"]].head(10).to_string(index=False))
print(df["domain"].value_counts().head(20).to_string())
PY
```
