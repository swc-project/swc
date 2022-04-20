#!/usr/bin/env bash
set -eu

if ! command -v creduce &> /dev/null
then
    echo "creduce not found. Installing"
    brew install creduce
    exit
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "Reducing $1"
ls -al $1

# Build swc minifier
export MINIFY=$(cargo profile bin-path --release --example compress)

wd="$(mktemp -d)"
echo "Using $MINIFY; dir = $wd"

cp $1 "$wd/input.js"
dir="$(dirname $1)"

# Verify that we can run `creduce`
(cd $wd && "$SCRIPT_DIR/../_/reduce/compare.sh")

(cd $wd && creduce "$SCRIPT_DIR/../_/reduce/compare.sh" "$wd/input.js")

REDUCED_SIZE=$(wc -c <"$wd/input.js")
hash=$(sha1sum < "$wd/input.js")
echo "Hash is $hash"
    
echo "Reduced size is $REDUCED_SIZE bytes"

if [[ $REDUCED_SIZE -le 3 ]]; then
    echo "Removing $1"
    rm -rf $1
    ./scripts/_/notify.sh "Removed $1"
    (cd $dir && git commit -m "Remove a file as it didn't break anything" $1)
else
    cat $wd/input.js
    # mkdir -p "$SCRIPT_DIR/../tests/fixture/reduced/$hash"
    # cp "$wd/input.js" "$SCRIPT_DIR/../tests/fixture/reduced/$hash/input.js"
    ./scripts/_/notify.sh "Found errornous input"
fi
