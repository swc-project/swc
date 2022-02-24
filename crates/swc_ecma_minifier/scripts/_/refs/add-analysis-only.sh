#!/usr/bin/env bash
set -eu

# Add a direcotry ($1) to git if only analysis result is modified


if [[ -f "$1/input.js" ]]; then
    git diff --exit-code "$1/output.js" > /dev/null
    echo $1
    git add "$1/analysis-snapshot.rust-debug"
fi