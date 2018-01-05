#!/bin/sh
set -eu

reset

cargo fmt
cargo doc -p swc_ecma_ast
cargo doc
cargo check

export RUST_TEST_THREADS=1
export RUST_LOG="swc_ecmascript::parser=debug" 

# cargo test --lib parser
cargo test --test test262 -- --test-threads 1