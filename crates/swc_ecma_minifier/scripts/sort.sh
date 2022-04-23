#!/usr/bin/env bash
set -eu

# Fix sorting differences between Linux and Mac
export LC_ALL=C

function sortOne() {
    cat $file | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/sorted.txt
    mv tests/sorted.txt $file
}

sortOne tests/golden.txt
sortOne tests/TODO.txt
sortOne tests/postponed.txt

# Don't mark ignored test as golden
comm -23 tests/golden.txt tests/TODO.txt > tests/nodup.txt
mv tests/nodup.txt tests/golden.txt