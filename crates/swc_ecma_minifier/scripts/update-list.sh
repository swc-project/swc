#!/usr/bin/env bash
#
# This script updates golden.txt and TODO.txt
# 
#
# Note that even if a test is ignored, this script will invoke it.
#
set -eu


# Clean the ignore list
echo '' > tests/TODO.txt

unset SWC_RUN
unset SWC_CHECK

# Update golden.txt
cargo test --test compress --all-features fixture_tests__terser__compress__ \
  | grep 'fixture_tests__terser__compress__' \
  | grep 'js .\.\. ok$' \
  | sed -e 's!test fixture_tests__terser__compress__!!' \
  | sed -e 's! ... ok!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/golden.txt

# Update TODO.txt
cargo test --test compress 'fixture_tests__terser__compress__' \
  | grep 'fixture_tests__terser__compress__' \
  | grep 'js .\.\. FAILED$' \
  | sed -e 's!test fixture_tests__terser__compress__!!' \
  | sed -e 's! ... FAILED!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/TODO.txt

./scrtips/sort.sh