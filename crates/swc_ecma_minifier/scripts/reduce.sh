#!/usr/bin/env bash
set -eu

if ! command -v creduce &> /dev/null
then
    echo "creduce not found. Installing"
    brew install creduce
    exit
fi

cp $1 input.js

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "Reducing $1"
ls -al $1

# Build swc minifier
export MINIFY=$(cargo profile bin-path --release --example minifier)

echo "Using $MINIFY"

# Verify that we can run `creduce`
$SCRIPT_DIR/_/reduce/compare.sh

creduce "$SCRIPT_DIR/_/reduce/compare.sh" input.js

REDUCED_SIZE=$(wc -c <"input.js")

echo "Reduced size is $REDUCED_SIZE bytes"

if [[ "$1" == *"inputs"* && $REDUCED_SIZE -le 3 ]]; then
    echo "Removing $1"
    git rm --force $1 || true
    rm -rf $1
    ./scripts/_/notify.sh "Removed $1"
    git commit -m 'Remove useless input'

    find ./inputs -type d -empty -delete
else
    ./scripts/_/notify.sh "Found errornous input"
fi
