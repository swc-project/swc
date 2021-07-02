#!/usr/bin/env bash
set -eu

# Temporary
export RUST_MIN_STACK=$((16*1024*1024))

# Prevent regression
./scripts/run.sh fixture_terser__compress__

export RUST_LOG=swc_ecma_minifier=trace
touch tests/compress.rs

UPDATE=1 cargo test --test compress projects -- --nocapture || true

# Make it easier to compare
prettier --write tests/projects/output
ls -al ./tests/projects/output
ls -al ./tests/projects/refs