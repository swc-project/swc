#!/usr/bin/env bash

set -eu

crate=$1

# If crate has feature 'concurrent', build it with feature
if [[ $(./scripts/cargo/list-features.sh $crate) == *"concurrent"* ]]; then
    if [[ $(./scripts/cargo/list-dependencies.sh $crate) == *"swc_parallel"* ]]; then
        echo "Building $crate with feature 'chili'"
        cargo codspeed build -p $crate --features concurrent,swc_parallel/chili
    else
        echo "Building $crate with feature 'concurrent'"
        cargo codspeed build -p $crate --features concurrent
    fi
else
    echo "Building $crate"
    cargo codspeed build -p $crate
fi