#!/bin/bash
set -eu
cat tests/done.txt | awk NF | sort | uniq | awk '{$1=$1};1' | uniq | sort > tests/done_sorted.txt
mv tests/done_sorted.txt tests/done.txt