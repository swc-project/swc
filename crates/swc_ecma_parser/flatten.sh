#!/usr/bin/env bash
set -eu

# Remove empty directories
find . -type d -empty -delete

find ./tests/tsc -type f \( -iname 'input.ts.json' -o -iname 'input.tsx.json' \) -delete

find ./tests/tsc -type f \( -iname 'input.ts' -o -iname 'input.tsx' \) | xargs -L 1 ./flatten-one-tsc-test.sh