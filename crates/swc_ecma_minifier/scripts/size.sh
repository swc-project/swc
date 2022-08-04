#!/usr/bin/env bash
set -eu

for f in ./benches/full/*.js; do RUST_LOG=off cargo run --example minifier -- $f && gzip -9 -c output.js | wc -c; done