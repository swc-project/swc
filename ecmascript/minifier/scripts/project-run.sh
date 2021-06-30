#!/usr/bin/env bash
set -u

export RUST_LOG=swc_ecma_minifier=trace
touch tests/compress.rs

UPDATE=1 cargo test --test compress projects -- --nocapture

# Make it easier to compare
prettier --write tests/projects/output
ls -al ./tests/projects/output
ls -al ./tests/projects/refs