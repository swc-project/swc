#!/usr/bin/env bash

set -eu


export RUST_LOG=trace
# export SWC_CHECK=1

cargo test --features concurrent --features debug --test exec --test terser_exec