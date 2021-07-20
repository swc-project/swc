#!/usr/bin/env bash
#
# This script exists to prevent regression.
#
# This script invoked tests two time.
# For first, it runs tests in no-regression mode.
# In the mode, only tests listed in tests/golden.txt will be tested.
# 
# For second invokation, arguments are passed to cargo test so the user can
# filter tests.
#
set -eu

export RUST_LOG=swc_ecma_minifier=trace

# To prevent regression, we run base test before real tests.
touch tests/compress.rs
UPDATE=1 ./scripts/base.sh base_fixture
./scripts/base.sh base_exec

if [ -z "$@" ]; then
    ./scripts/sort.sh

    SWC_RUN=0 GOLDEN_ONLY=1 cargo test -q --test compress --all-features 
fi

SKIP_GOLDEN=1 cargo test --test compress --all-features $@
