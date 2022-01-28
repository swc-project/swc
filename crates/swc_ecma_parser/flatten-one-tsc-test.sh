#!/usr/bin/env bash
set -eu

echo "Moving $1"

test_name="$(dirname $1)"

filename=$(basename -- "$1")
extension="${filename##*.}"

TO="$test_name.${extension}"

echo "TestFile: $1"
echo "$TO"
mv $1 $TO