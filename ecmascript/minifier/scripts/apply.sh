#!/usr/bin/env bash
set -eux


# Prevent regression
./scripts/run.sh

export RUST_BACKTRACE=1
export RUST_LOG=debug,swc_ecma_minifier=trace

UPDATE=1 cargo test -q --test compress projects__files --all-features || true

# # Make it easier to compare
# prettier --write tests/projects/output
# yarn run eslint --fix ./tests/projects/output/

# ls -al ./tests/projects/output
# ls -al ./tests/projects/refs