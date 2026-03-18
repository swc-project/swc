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

python3 - "$TARGET_DIR" "$HERMES_REPO" "$HERMES_BRANCH" "$HERMES_COMMIT" <<'PY'
import datetime as dt
import json
import pathlib
import sys


target_dir = pathlib.Path(sys.argv[1])
repo = sys.argv[2]
branch = sys.argv[3]
commit = sys.argv[4]
corpus_dir = target_dir / "corpus"

expected_lines = []
known_fail = []

for js_path in sorted(corpus_dir.rglob("*.js")):
    rel = js_path.relative_to(corpus_dir).as_posix()

    tree_path = js_path.with_suffix(".tree.json")
    if not tree_path.exists():
        raise SystemExit(f"missing .tree.json for {rel}")

    tree = json.loads(tree_path.read_text(encoding="utf-8"))
    has_error = bool(tree.get("errors"))
    expected_lines.append(f"{rel}\t{'true' if has_error else 'false'}")

(target_dir / "expected-errors.txt").write_text("\n".join(expected_lines) + "\n", encoding="utf-8")
(target_dir / "known-fail.txt").write_text("\n", encoding="utf-8")

upstream_readme = (target_dir / "upstream-flowtest-README.md").read_text(encoding="utf-8")
flow_commit = None
for line in upstream_readme.splitlines():
    if line.startswith("Flow git commit:"):
        flow_commit = line.split(":", 1)[1].strip()
        break

metadata = {
    "source": {
        "repo": repo,
        "branch": branch,
        "commit": commit,
        "flow_commit": flow_commit,
    },
    "generated_at_utc": dt.datetime.now(tz=dt.timezone.utc).isoformat(),
    "counts": {
        "js": len(list(corpus_dir.rglob("*.js"))),
        "tree_json": len(list(corpus_dir.rglob("*.tree.json"))),
        "options_json": len(list(corpus_dir.rglob("*.options.json"))),
        "known_fail": len(known_fail),
    },
}

(target_dir / "metadata.json").write_text(
    json.dumps(metadata, indent=2, sort_keys=True) + "\n",
    encoding="utf-8",
)
PY


echo "[flow-hermes] Sync completed"
