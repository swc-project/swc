#!/usr/bin/env bash
set -eu

export SWC_RUN=0

cargo test --test compress --all-features ${1-''} \
  | grep 'terser__compress' \
  | grep 'js .\.\. FAILED$' \
  | sed -e 's!test fixture_terser__compress__!!' \
  | sed -e 's! ... FAILED!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/ignored.txt

./scripts/sort.sh