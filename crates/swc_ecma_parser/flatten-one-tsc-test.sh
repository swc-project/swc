#!/usr/bin/env bash
set -eu

echo "Moving $1"

TEST_DIR="$(dirname $1)"
TO="./tests/typescript/tsc/"

echo $TEST_DIR
echo $TO
# mv $TEST_DIR $TO