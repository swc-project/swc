#!/usr/bin/env bash

export CI=1
cargo test --test fixture
cargo test --test deno