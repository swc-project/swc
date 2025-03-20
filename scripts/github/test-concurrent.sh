#!/usr/bin/env bash

set -eu

crate=$1

echo "Checking if '$crate' has feature 'concurrent'"

# Get crates with feature named `concurrent`
CRATES=$(./scripts/cargo/list-crates.sh | \
    jq -r 'select(.features.concurrent != null) | .name')

if [[ "swc" == "$1" ]]; then
    echo "Skipping swc itself"
    exit 0
fi

if [[ $(./scripts/cargo/list-features.sh $crate) == *"concurrent"* ]]; then
    if [[ $(./scripts/cargo/list-dependencies.sh $crate) == *"swc_parallel"* ]]; then
        cargo test --color always -p $crate --all-targets --features concurrent --features swc_parallel/chili
    else
        cargo test --color always -p $crate --all-targets --features concurrent
    fi
fi
