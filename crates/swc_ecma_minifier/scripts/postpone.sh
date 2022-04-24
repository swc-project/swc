#!/usr/bin/env bash
#
# This script interactively postpone tests
set -u

echo '' > tests/TODO.txt

git restore tests/terser

tests="$(UPDATE=1 DIFF=0 cargo test --test compress $1 \
  | grep 'fixture_tests__terser__compress__' \
  | grep 'js .\.\. FAILED$' \
  | sed -e 's!test fixture_tests__terser__compress__!!' \
  | sed -e 's! ... FAILED!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!')"
 
 
 
for file in $tests; do
  ./scripts/_/postpone/ask-file.sh "$file"
done



git restore tests/terser
./scripts/update-list.sh