#!/usr/bin/env bash

set -eu

echo "Building all crates for codspeed"

# Get crates with feature named `concurrent`
CRATES=$(./scripts/cargo/list-crates.sh | jq -r '.name')

for crate in $CRATES; do
    # If crate is swc_plugin_runner, skip it
    if [[ $crate == "swc_plugin_runner" ]]; then
        continue
    fi

    # If crate has feature 'concurrent', build it with feature
    if [[ $(./scripts/cargo/list-features.sh $crate) == *"concurrent"* ]]; then
        echo "Building $crate with feature 'concurrent'"
        cargo codspeed build -p $crate --features "$crate/concurrent"
    else
        echo "Building $crate"
        cargo codspeed build -p $crate
    fi
done
