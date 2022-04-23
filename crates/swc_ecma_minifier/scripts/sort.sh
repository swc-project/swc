#!/usr/bin/env bash
set -eu

# Fix sorting differences between Linux and Mac
export LC_ALL=C

function sortOne() {
    cat $1 | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/sorted.txt
    mv tests/sorted.txt $1
}

sortOne tests/golden.txt
sortOne tests/TODO.txt
sortOne tests/postponed.txt

# Don't mark postponed test as todo
comm -23 tests/TODO.txt tests/postponed.txt > tests/nodup.txt
mv tests/nodup.txt tests/TODO.txt

# Don't mark ignored test as golden
comm -23 tests/golden.txt tests/TODO.txt > tests/nodup.txt
mv tests/nodup.txt tests/golden.txt

# Don't mark postponed test as golden
comm -23 tests/golden.txt tests/postponed.txt > tests/nodup.txt
mv tests/nodup.txt tests/golden.txt

# This is ignored because cargo returns `ok` for postponed/ignored tests.
#
# # Don't mark passing test as postponed
# comm -23 tests/postponed.txt tests/golden.txt > tests/nodup.txt
# mv tests/nodup.txt tests/postponed.txt