#!/usr/bin/env bash
set -eu

export RUST_LOG=swc_ecma_minifier=trace

# To prevent regression, we run base test before real tests.
touch tests/compress.rs
cargo test --test compress ${1-base_exec} -q --all-features
