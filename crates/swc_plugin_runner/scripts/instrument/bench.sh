#!/usr/bin/env bash
#
# This instruments a full benchmark suite.
#
# Usage:
#
#   ./scripts/instrument/bench.sh typescript

export CARGO_MANIFEST_DIR=$(pwd)
export RUST_LOG=off
cargo profile instruments -t time --bench invoke --features rkyv-impl --release -- $@