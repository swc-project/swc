#!/usr/bin/env bash
set -eux

# UPDATE=0 cargo test --test typescript

export RUST_TEST_TIME_INTEGRATION=1000,3000
# cargo test --test errors $@ -- -Z unstable-options --ensure-time
cargo test --test errors $@
