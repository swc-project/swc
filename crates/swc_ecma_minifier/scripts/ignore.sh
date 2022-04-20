#!/usr/bin/env bash
set -eu

unset SWC_RUN
unset SWC_CHECK

cargo test --test compress --all-features ${1-'fixture_tests__terser__compress__'} \
  | grep 'fixture_tests__terser__compress__' \
  | grep 'js .\.\. FAILED$' \
  | sed -e 's!test fixture_tests__terser__compress__!!' \
  | sed -e 's! ... FAILED!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/TODO.txt

./scripts/sort.sh