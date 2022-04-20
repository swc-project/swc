#!/usr/bin/env bash
#
# This script automatically add tests to golden.
# Note that this is append-only.
set -eu

unset SWC_RUN
unset SWC_CHECK

cargo test --test compress --all-features fixture_tests__terser__compress__ \
  | grep 'fixture_tests__terser__compress__' \
  | grep 'js .\.\. ok$' \
  | sed -e 's!test fixture_tests__terser__compress__!!' \
  | sed -e 's! ... ok!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/golden.txt

./scripts/sort.sh
