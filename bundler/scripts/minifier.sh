#!/usr/bin/env bash
set -eu

export RUST_LOG=swc_ecma_minifier=trace
export RUST_BACKTRACE=1

cargo test --features swc_ecma_minifier/debug --test deno $1