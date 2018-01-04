#!/bin/sh
set -eu

reset

cargo fmt --all
cargo check
cargo doc

export RUST_LOG="swc_ecmascript::parser=debug" 

# cargo test --lib 
cargo test --test test262 -- --test-threads 1