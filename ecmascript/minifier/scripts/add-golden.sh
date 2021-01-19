#!/usr/bin/env bash
#
# This script automatically add tests to golden.
# Note that this is append-only.
set -eu

cargo test --test test \
  | grep 'js .\.\. ok$' \
  | sed -e 's!test terser_compress_terser__compress__!!' \
  | sed -e 's! ... ok!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/golden.txt

./scripts/sort.sh
