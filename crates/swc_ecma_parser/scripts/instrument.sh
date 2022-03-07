#!/usr/bin/env bash
set -eu

cargo profile instruments --release -t time --features tracing/release_max_level_info --features swc_common/concurrent --features swc_common/parking_lot --example perf