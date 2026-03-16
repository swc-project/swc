#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT_DIR/tests/fixtures/upstream_manifest.txt"
OUT_DIR="$ROOT_DIR/tests/fixtures/upstream"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required" >&2
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

  api_path="repos/facebook/react/contents/compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/${name}.expect.md?ref=main"
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
