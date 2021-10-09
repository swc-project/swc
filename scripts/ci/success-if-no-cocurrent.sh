#!/usr/bin/env bash

set -eu

echo "Checking if '$1' has feature 'concurrent'"

# Get crates with feature named `concurrent`
CRATES=$(./scripts/cargo/list-crates.sh | \
    jq -r 'select(.features.concurrent != null) | .name')


if [[ $CRATES == *"$1"* ]]; then
    # We have a feature named `concurrent`
    echo "Crate '$1' has feature 'concurrent'"
    exit 1
fi
