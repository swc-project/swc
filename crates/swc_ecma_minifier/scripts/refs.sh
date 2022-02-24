#!/usr/bin/env bash
set -eu

## Update all test references

export DIFF=0
export UPDATE=1

cargo test -p swc_ecma_minifier -p swc --no-fail-fast || true

# find ../swc/tests/ -type f -empty -delete

set +e
find tests/compress/fixture -type d -exec ./scripts/_/refs/add-analysis-only.sh {} \;
find tests/terser -type d -exec ./scripts/_/refs/add-analysis-only.sh {} \;
