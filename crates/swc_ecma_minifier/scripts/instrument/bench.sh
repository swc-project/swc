#!/usr/bin/env bash
#
# This instruments a full benchmark suite.
#
# Usage:
#
#   ./scripts/bench/instrument typescript


export RUST_LOG=off
cargo profile instruments -t time --bench full --release -- $@