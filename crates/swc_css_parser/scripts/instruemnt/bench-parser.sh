#!/usr/bin/env bash
set -eu

export RUST_LOG=off
export MIMALLOC_SHOW_STATS=1

cargo profile instruments --release -t time --features swc_common/concurrent --bench parser -- --bench --color