#!/usr/bin/env bash
set -eu
cat tests/golden.txt | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/golden_sorted.txt
mv tests/golden_sorted.txt tests/golden.txt