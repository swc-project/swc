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

# Build swc minifier
export MINIFY=$(cargo profile bin-path --example minifier)

echo "Using $MINIFY"

creduce "$SCRIPT_DIR/_/reduce/compare.sh" input.js

REDUCED_SIZE=$(wc -c <"input.js")

if [ $REDUCED_SIZE -le 3 ]; then
    git rm --force $1
    git commit -m 'Remove useless input'
    echo "Reduced size is $REDUCED_SIZE bytes. Removing"
fi
