#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CRATE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_DIR="$CRATE_DIR/tests/flow-hermes"
CORPUS_DIR="$TARGET_DIR/corpus"

HERMES_REPO="facebook/hermes"
HERMES_BRANCH="${1:-main}"

TMP_DIR="$(mktemp -d -t swc-flow-hermes-XXXXXX)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

HERMES_DIR="$TMP_DIR/hermes"

echo "[flow-hermes] Cloning $HERMES_REPO#$HERMES_BRANCH"
gh repo clone "$HERMES_REPO" "$HERMES_DIR" -- --depth 1 --branch "$HERMES_BRANCH" --filter=blob:none --sparse

(
  cd "$HERMES_DIR"
  git sparse-checkout set external/flowtest
)

UPSTREAM_FLOWTEST_DIR="$HERMES_DIR/external/flowtest"
UPSTREAM_CORPUS_DIR="$UPSTREAM_FLOWTEST_DIR/test/flow"

if [[ ! -d "$UPSTREAM_CORPUS_DIR" ]]; then
  echo "[flow-hermes] missing upstream corpus directory: $UPSTREAM_CORPUS_DIR" >&2
  exit 1
fi

mkdir -p "$CORPUS_DIR"

# Keep corpus fully in sync with upstream snapshot.
rsync -a --delete "$UPSTREAM_CORPUS_DIR/" "$CORPUS_DIR/"
cp "$UPSTREAM_FLOWTEST_DIR/README.md" "$TARGET_DIR/upstream-flowtest-README.md"

HERMES_COMMIT="$(cd "$HERMES_DIR" && git rev-parse HEAD)"

node "$SCRIPT_DIR/sync_flow_hermes_metadata.js" \
  "$TARGET_DIR" \
  "$HERMES_REPO" \
  "$HERMES_BRANCH" \
  "$HERMES_COMMIT"


echo "[flow-hermes] Sync completed"
