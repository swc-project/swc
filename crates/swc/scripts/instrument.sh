#!/usr/bin/env bash
set -eu

export RUST_LOG=off

cargo profile instruments --release -t time --bench minify --features tracing/release_max_level_info -- --bench $@
# MINIFY=1 cargo profile instruments --release -t time --bench typescript --features concurrent,tracing/release_max_level_info $@