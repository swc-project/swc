#!/usr/bin/env bash
set -eu

export SWC_RUN=0

cargo test --test compress --all-features ${1-'fixture_tests__terser__compress__'} \
  | grep 'fixture_tests__terser__compress__' \
  | grep 'js .\.\. FAILED$' \
  | sed -e 's!test fixture_tests__terser__compress__!!' \
  | sed -e 's! ... FAILED!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/ignored.txt

./scripts/sort.sh