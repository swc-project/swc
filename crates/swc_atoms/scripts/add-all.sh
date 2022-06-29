#!/usr/bin/env bash
set -eu

cargo build -p dbg-swc
BINARY="$(cargo metadata --format-version 1 | jq -r '.target_directory')/debug/dbg-swc"
echo "Binary:$BINARY"
# TypeScript libraries has lots of commonly used identifiers.
ls ../../node_modules/typescript/lib/lib.*.d.ts | xargs -L 1 -I {} $BINARY x print-atoms {} | sed -r '/^.{,3}$/d' >> words.txt || true

./scripts/sort.sh
