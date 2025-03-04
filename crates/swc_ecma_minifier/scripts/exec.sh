#!/usr/bin/env bash

set -eu


export RUST_LOG=debug
# export SWC_CHECK=1
export MIMALLOC_SHOW_STATS=0

cargo test -q --features concurrent --features debug --test exec --test terser_exec $@