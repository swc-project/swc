#!/usr/bin/env bash
set -eux

cargo test --test fixture
cargo test --test deno $@