#!/usr/bin/env bash
set -eu


# Prevent regression
./scripts/run.sh fixture_terser__compress__

export RUST_BACKTRACE=1
export RUST_LOG=swc_ecma_minifier=trace
touch tests/compress.rs

UPDATE=1 cargo test --test compress projects || true

# Make it easier to compare
# prettier --write tests/projects/output
yarn run eslint --fix ./tests/projects/output/

ls -al ./tests/projects/output
ls -al ./tests/projects/refs