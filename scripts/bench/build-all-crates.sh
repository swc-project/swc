#!/usr/bin/env bash

set -eu

echo "Building all crates for codspeed"

WS_CRATES=$(./scripts/cargo/list-crates.sh)

# Get crate names
CRATE_NAMES=$(echo "$WS_CRATES" | jq -r '.name')

for crate in $CRATE_NAMES; do
    # If crate is swc_plugin_runner, skip it
    if [[ $crate == "swc_plugin_runner" ]]; then
        continue
    fi
    
    crate_info=$(echo "$WS_CRATES" | jq -r 'select(.name == "'$crate'")')
    echo $crate_info

    # If crate has feature 'concurrent', build it with feature
    if [[ $(./scripts/cargo/list-features.sh $crate) == *"concurrent"* ]]; then
        echo "Building $crate with feature 'concurrent'"
        cargo codspeed build -p $crate --features "$crate/concurrent"
    else
        echo "Building $crate"
        cargo codspeed build -p $crate
    fi
done
