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

if [ -z "$@" ]; then
    ./scripts/sort.sh

    export RUST_LOG=swc_ecma_minifier=trace

    GOLDEN_ONLY=1 cargo test --test compress
fi

cargo test --test compress $@
