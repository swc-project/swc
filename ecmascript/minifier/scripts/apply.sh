#!/usr/bin/env bash
set -eux


# Prevent regression
./scripts/run.sh

export RUST_BACKTRACE=1
export RUST_LOG=swc_ecma_minifier=trace
touch tests/compress.rs

UPDATE=1 cargo test --test compress projects --all-features || true

# Make it easier to compare
prettier --write tests/projects/output
yarn run eslint --fix ./tests/projects/output/

ls -al ./tests/projects/output
ls -al ./tests/projects/refs