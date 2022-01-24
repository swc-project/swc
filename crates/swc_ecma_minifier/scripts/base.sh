#!/usr/bin/env bash
set -eux

export RUST_LOG=swc_ecma_minifier=trace

# To prevent regression, we run base test before real tests.
cargo test --test compress -q ${1-base_exec}
