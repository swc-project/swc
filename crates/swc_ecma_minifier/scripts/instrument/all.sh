#!/usr/bin/env bash
#
# This instruments whole input directory
#
# Usage:
#
#   ./scripts/instrument/all.sh path/to/dir


export RUST_LOG=off
cargo profile instruments -t time --example minify-all --features swc_common/perf --release -- $@