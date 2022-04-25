#!/usr/bin/env bash
#
# This script updates golden.txt and TODO.txt
# 
#
# Note that even if a test is ignored, this script will invoke it.
#
set -eu

function sortFile() {
    cat $1 | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/sorted.txt
    mv tests/sorted.txt $1
}

# Clean the ignore list
echo '' > tests/TODO.txt
echo '' > tests/golden.txt
mv tests/postponed.txt tests/postponed.tmp.txt
echo '' > tests/postponed.txt

unset SWC_RUN
unset SWC_CHECK

# Update golden.txt
cargo test --test compress fixture_tests__terser__compress__ \
  | grep 'fixture_tests__terser__compress__' \
  | grep 'js .\.\. ok$' \
  | sed -e 's!test fixture_tests__terser__compress__!!' \
  | sed -e 's! ... ok!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/golden.txt

sortFile tests/golden.txt

# Don't mark passing tests as postponed
comm -23 tests/postponed.tmp.txt tests/golden.txt > tests/nodup.txt
mv tests/nodup.txt tests/postponed.txt
rm tests/postponed.tmp.txt

sortFile tests/postponed.txt

# Update TODO.txt
cargo test --test compress 'fixture_tests__terser__compress__' \
  | grep 'fixture_tests__terser__compress__' \
  | grep 'js .\.\. FAILED$' \
  | sed -e 's!test fixture_tests__terser__compress__!!' \
  | sed -e 's! ... FAILED!!' \
  | sed -e 's!__!/!g' \
  | sed -e 's!_js!.js!' \
  >> tests/TODO.txt

sortFile tests/TODO.txt

# Don't mark postponed test as todo
comm -23 tests/TODO.txt tests/postponed.txt > tests/nodup.txt
mv tests/nodup.txt tests/TODO.txt

