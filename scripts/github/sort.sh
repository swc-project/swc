#!/usr/bin/env bash
set -eu

cat $1 | awk '{$1=$1};1' | uniq | sort > tmp.txt
mv tmp.txt $1