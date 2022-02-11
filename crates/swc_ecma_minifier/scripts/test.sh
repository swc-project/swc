#!/usr/bin/env bash


export DIFF=0
export UPDATE=1

cargo test -p swc_ecma_minifier -p swc

# find ../swc/tests/ -type f -empty -delete