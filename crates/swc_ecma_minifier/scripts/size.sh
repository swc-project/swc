#!/usr/bin/env bash
set -eu

export UPDATE=1
export DIFF=0
export RUST_LOG=off

for f in ./benches/full/*.js; do RUST_LOG=off cargo run --example minifier -- $f && gzip -c output.js | wc -c; done