#!/usr/bin/env bash

set -eu

echo "Checking if '$1' has feature 'concurrent'"

# Get crates with feature named `concurrent`
CRATES=$(./scripts/cargo/list-crates.sh | \
    jq -r 'select(.features.concurrent != null) | .name')

if [[ "swc" == "$1" ]]; then
    echo "Skipping swc itself"
    exit 0
fi

if [[ $CRATES == *"$1"* ]]; then
    cargo test --color always -p $1 --all-targets --features "$1/concurrent"
fi