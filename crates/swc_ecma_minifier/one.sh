#!/usr/bin/env bash
#
# Script used by @kdy1 to test the minifier.
#
# This will be removed in future.
#

set -eux

export RUST_LOG=swc_ecma_minifier=trace
cargo test $@ --features debug --test compress