#!/usr/bin/env bash
#
# Used to publish MVP.
#
# Use this script with test name if the minifier of swc does not break code.
#
set -eu

find tests/compress/exec -name output.js | xargs -L 1 rm
find tests/compress/exec -name expected.stdout | xargs -L 1 rm
find tests/compress/exec -name output.terser.js | xargs -L 1 rm
find tests/compress/exec -name mangle.json | xargs -L 1 rm
find tests/compress/exec -empty -type d -delete

cargo test --test compress --all-features ${1-''} \
  | grep 'terser__compress' \
  | grep 'js .\.\. FAILED$' \
  | sed -e 's!test fixture_terser__compress__!!' \
  | sed -e 's! ... FAILED!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/postponed_candidates.txt


comm -23 tests/postponed_candidates.txt tests/golden.txt >> tests/postponed.txt
rm tests/postponed_candidates.txt

./scripts/sort.sh