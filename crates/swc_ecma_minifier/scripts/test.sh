#!/usr/bin/env bash


export DIFF=0
export UPDATE=1
export SWC_CHECK=0
export SWC_RUN=0

cargo test -p swc_ecma_minifier -p swc --no-fail-fast

# find ../swc/tests/ -type f -empty -delete