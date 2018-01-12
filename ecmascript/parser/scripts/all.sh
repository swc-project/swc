#!/bin/sh
set -eu

reset

export DBG_DUMP=1
cargo fmt >&2
cargo doc -p swc_ecma_ast -p swc_macros_common >&2
cargo check >&2
cargo doc >&2

export RUST_TEST_THREADS=1
export RUST_LOG="swc_ecmascript::parser=debug" 

# cargo test --lib parser
cargo test --test test262