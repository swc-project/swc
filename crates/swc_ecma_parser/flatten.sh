#!/usr/bin/env bash
set -eu

# Remove empty directories
find . -type d -empty -delete

find ./tests/tsc -mindepth 3 -type f \( -iname 'input.ts' -o -iname 'input.tsx' \) | xargs -L 1 ./flatten-one-tsc-test.sh