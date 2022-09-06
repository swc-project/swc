#!/usr/bin/env bash
set -eu

export UPDATE=1
export DIFF=0
export RUST_LOG=off

for f in ./benches/full/*.js; do cargo run --release --features concurrent --example minifier -- $f && gzip -9 -c output.js | wc -c; done