#!/usr/bin/env bash
set -eu

echo ''
echo ''
echo ''
echo "Comparing $1"
EXPECTED=$(terser "$1" | xargs)
ACTUAL=$(cat "$1" | xargs)

if [[ $EXPECTED == $ACTUAL || $EXPECTED == "$ACTUAL;" ]]; then
    echo "PASSED";
    git add "$1"
else
    echo $EXPECTED
    echo $ACTUAL
    echo "FAILED"
fi
