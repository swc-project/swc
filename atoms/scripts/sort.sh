#!/usr/bin/env bash
set -eu

cat words.txt | awk '{$1=$1};1' | uniq | sort > words_sorted.txt
mv words_sorted.txt words.txt