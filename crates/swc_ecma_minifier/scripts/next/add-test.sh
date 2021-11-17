#!/usr/bin/env bash
set -eu

# Usage: Invoke this script using full path from a next app.

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

export NEXT_DEBUG_MINIFY=1

# Remove preovious builds
rm -r .next


npx next build | grep '{ name:' | node "$SCRIPT_DIR/evaluate.js"
touch "$SCRIPT_DIR/../../tests/compress.rs"