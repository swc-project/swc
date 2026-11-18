#!/usr/bin/env bash
set -eu

sed '/^[[:space:]]*$/d' words.txt | awk '{$1=$1};1' | uniq | node ./scripts/_/sort.js > words_sorted.txt
mv words_sorted.txt words.txt
