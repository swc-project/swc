#!/usr/bin/env bash
set -eu

# Fix sorting differences between Linux and Mac
export LC_ALL=C

cat tests/golden.txt | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/golden_sorted.txt
mv tests/golden_sorted.txt tests/golden.txt

cat tests/ignored.txt | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/ignored_sorted.txt
mv tests/ignored_sorted.txt tests/ignored.txt