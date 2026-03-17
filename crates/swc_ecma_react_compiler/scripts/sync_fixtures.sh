#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEFAULT_MANIFEST="$ROOT_DIR/tests/fixtures/upstream_manifest.txt"
DEFAULT_OUT_DIR="$ROOT_DIR/tests/fixtures/upstream"
DEFAULT_REF="c80a07509582daadf275f36ffe7a88c3b12e9db4"

MANIFEST="$DEFAULT_MANIFEST"
OUT_DIR="$DEFAULT_OUT_DIR"
REF="$DEFAULT_REF"

usage() {
  cat <<'EOF'
Usage: sync_fixtures.sh [--manifest <path>] [--out-dir <path>] [--ref <git-ref>]

Options:
  --manifest  Manifest file with fixture names (without .expect.md extension)
  --out-dir   Output fixture directory
  --ref       Git ref in facebook/react (default: main)
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --manifest)
      MANIFEST="$2"
      shift 2
      ;;
    --out-dir)
      OUT_DIR="$2"
      shift 2
      ;;
    --ref)
      REF="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required" >&2
  exit 1
fi

if [[ ! -f "$MANIFEST" ]]; then
  echo "manifest not found: $MANIFEST" >&2
  exit 1
fi

extract_block() {
  local section="$1"
  local file="$2"
  awk -v section="$section" '
    $0 ~ "^## " section "$" {
      in_section = 1
      in_code = 0
      next
    }
    in_section && /^## / {
      in_section = 0
      in_code = 0
    }
    in_section && /^```/ {
      if (in_code == 0) {
        in_code = 1
        next
      }
      exit
    }
    in_section && in_code {
      print
    }
  ' "$file"
}

mkdir -p "$OUT_DIR"

while IFS= read -r raw_name; do
  name="${raw_name%%#*}"
  name="$(echo "$name" | xargs)"
  if [[ -z "$name" ]]; then
    continue
  fi

  api_path="repos/facebook/react/contents/compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/${name}.expect.md?ref=${REF}"
  tmp_file="$(mktemp)"

  gh api "$api_path" | jq -r '.content' | base64 --decode > "$tmp_file"

  fixture_dir="$OUT_DIR/$name"
  mkdir -p "$fixture_dir"

  extract_block "Input" "$tmp_file" > "$fixture_dir/input.js"

  code_block="$(extract_block "Code" "$tmp_file" || true)"
  error_block="$(extract_block "Error" "$tmp_file" || true)"

  if [[ -n "$code_block" ]]; then
    printf '%s\n' "$code_block" > "$fixture_dir/output.js"
    rm -f "$fixture_dir/error.txt"
  elif [[ -n "$error_block" ]]; then
    printf '%s\n' "$error_block" > "$fixture_dir/error.txt"
    rm -f "$fixture_dir/output.js"
  else
    echo "warn: neither Code nor Error section found for $name" >&2
  fi

  rm -f "$tmp_file"
  echo "synced: $name"
done < "$MANIFEST"
