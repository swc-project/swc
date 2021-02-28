#!/usr/bin/env bash
set -eux

export CI=1
cargo test --test fixture
cargo test --test deno