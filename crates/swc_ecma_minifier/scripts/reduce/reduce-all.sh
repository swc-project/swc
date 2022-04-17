#!/usr/bin/env bash
#
# Usage: ./scrtips/reduce-all.sh path/to/minifier-tasklist
#
# e.g:
#   - ./scrtips/reduce-all.sh ~/projects/minifier-tasklist
#   - ./scrtips/reduce-all.sh ~/projects/minifier-tasklist/react
#
# 
set -eu

dir="$1"

echo "Reducing javascript files in $dir"

find $dir -type f -name '*.js' -print0 | xargs -0 -P 4 -I {} sh -c './scripts/reduce/reduce.sh {}' || true

echo "Removing empty directories in $dir"

find $dir -type d -empty -delete
