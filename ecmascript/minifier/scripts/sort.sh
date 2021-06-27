#!/usr/bin/env bash
set -eu

# Fix sorting differences between Linux and Mac
export LC_ALL=C

cat tests/golden.txt | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/golden_sorted.txt
mv tests/golden_sorted.txt tests/golden.txt

cat tests/ignored.txt | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/ignored_sorted.txt
mv tests/ignored_sorted.txt tests/ignored.txt

cat tests/postponed.txt | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/postponed_sorted.txt
mv tests/postponed_sorted.txt tests/postponed.txt

# Don't mark ignored test as golden
comm -23 tests/golden.txt tests/ignored.txt > tests/nodup.txt
comm -23 tests/nodup.txt tests/postponed.txt > tests/nodup_2.txt
rm tests/nodup.txt
mv tests/nodup_2.txt tests/golden.txt