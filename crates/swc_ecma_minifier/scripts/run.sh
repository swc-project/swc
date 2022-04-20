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
set -eux

export RUST_LOG=debug,swc_ecma_minifier=trace

# Run unit tests.
cargo test --all-features --lib

# Run golden tests to prevent regression.
if [ -z "$@" ]; then
    ./scripts/sort.sh

    SWC_RUN=0 GOLDEN_ONLY=1 cargo test -q --test compress --all-features fixture_tests__terser__compress__
    SWC_RUN=0 GOLDEN_ONLY=1 UPDATE=1 cargo test -q --test compress --all-features fixture_tests__compress
fi

# To prevent regression, we run base test before real tests.
UPDATE=1 ./scripts/base.sh base_fixture
./scripts/base.sh base_exec

SKIP_GOLDEN=1 cargo test --test compress --all-features ${1:-fixture_tests__terser__compress__}
SKIP_GOLDEN=1 UPDATE=1 cargo test --test compress --all-features ${1:-fixture_tests__fixture__}
