#!/usr/bin/env bash
set -eu

export RUST_LOG=swc_ecma_minifier=trace
touch tests/compress.rs

UPDATE=1 cargo test --test compress projects -- --nocapture
UPDATE=1 cargo test --test compress projects -- --nocapture