#!/usr/bin/env bash
#
# This script automatically add tests to golden.
# Note that this is append-only.
set -eu

export SWC_RUN=0
export SWC_CHECK=0

cargo test --test compress --all-features fixture_tests__terser__compress__ \
  | grep 'fixture_tests__terser__compress__' \
  | grep 'js .\.\. ok$' \
  | sed -e 's!test fixture_tests__terser__compress__!!' \
  | sed -e 's! ... ok!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/golden.txt

./scripts/sort.sh
