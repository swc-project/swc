#!/usr/bin/env bash
set -eu

# Fix sorting differences between Linux and Mac
export LC_ALL=C

cat tests/golden.txt | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/golden_sorted.txt
mv tests/golden_sorted.txt tests/golden.txt

cat tests/TODO.txt | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/ignored_sorted.txt
mv tests/ignored_sorted.txt tests/TODO.txt

# Don't mark ignored test as golden
comm -23 tests/golden.txt tests/TODO.txt > tests/nodup.txt
mv tests/nodup.txt tests/golden.txt