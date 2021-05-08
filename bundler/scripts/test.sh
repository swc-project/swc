#!/usr/bin/env bash
set -eux

if [ -z "$@" ]; then
    cargo test --lib
    cargo test --test fixture
    (cd ../spack && cargo test --test fixture)
fi

cargo test --test deno $@ -- --nocapture
