#!/usr/bin/env bash
set -eu

export RUST_LOG=swc_ecma_minifier=debug
export RUST_BACKTRACE=1

cargo test --features swc_ecma_minifier/debug --test deno $@