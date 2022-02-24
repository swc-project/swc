#!/usr/bin/env bash
set -eu

export DIFF=0
export UPDATE=1

cargo test -p swc_ecma_minifier -p swc --no-fail-fast || true

# find ../swc/tests/ -type f -empty -delete