#!/usr/bin/env bash
set -eu

export UPDATE=1
export DIFF=0
export RUST_LOG=off
cargo test --test compress --features concurrent full_libs

for f in ./tests/lib-output/*.js; do echo "$f:" && gzip -9 -c $f | wc -c; done