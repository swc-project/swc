#!/usr/bin/env bash

set -eu


export RUST_LOG=trace
export SWC_CHECK=1

cargo test --test terser_exec --features debug
