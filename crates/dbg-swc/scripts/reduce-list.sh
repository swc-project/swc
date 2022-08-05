#!/usr/bin/env bash
set -eu

cat list.txt | xargs -L 1 -I {} ./scripts/reduce-size.sh {}