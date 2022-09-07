#!/usr/bin/env bash
set -eu

export RUST_LOG=off
export MIMALLOC_SHOW_STATS=1

cargo profile instruments --release -t time --features tracing/release_max_level_info --features swc_common/concurrent --features swc_common/parking_lot --bench parser -- --bench --color
