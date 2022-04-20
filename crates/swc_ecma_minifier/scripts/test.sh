#!/usr/bin/env bash


export DIFF=0
export UPDATE=1
unset SWC_CHECK
unset SWC_RUN

cargo test -p swc_ecma_minifier -p swc --no-fail-fast

# find ../swc/tests/ -type f -empty -delete