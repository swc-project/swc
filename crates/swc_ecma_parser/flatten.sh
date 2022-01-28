#!/usr/bin/env bash
set -eu

# Remove empty directories
find . -type d -empty -delete

find ./tests/typescript/tsc -mindepth 3 -type f \( -iname '*.ts' -o -iname '*.tsx' \) | xargs -L 1 ./scripts/_/flatten-one-tsc-test.sh