#!/usr/bin/env bash
set -eu

cargo test --test compress $1 \
  | grep 'js .\.\. FAILED$' \
  | sed -e 's!test fixture_terser__compress__!!' \
  | sed -e 's! ... FAILED!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/ignored.txt

./scripts/sort.sh