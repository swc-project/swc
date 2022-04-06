#!/usr/bin/env bash
#
# Script used by @kdy1 to test the minifier.
#
# This will be removed in future.
#

set -eux

export RUST_LOG=swc_ecma_minifier=trace,swc_ecma_transforms_optimization=trace
cargo test --features debug --features swc_ecma_transforms_optimization/debug --test compress $@ 