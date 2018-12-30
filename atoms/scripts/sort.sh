#!/bin/bash
set -eu

cat words.txt | uniq | sort > words_sorted.txt
mv words_sorted.txt words.txt