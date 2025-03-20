#!/usr/bin/env bash

set -eu

crate=$1

# If crate has feature 'concurrent', build it with feature
if [[ $(./scripts/cargo/list-features.sh $crate) == *"concurrent"* ]]; then
    echo "Building $crate with feature 'concurrent'"
    cargo codspeed build -p $crate --features concurrent
else
    echo "Building $crate"
    cargo codspeed build -p $crate
fi