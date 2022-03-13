#!/usr/bin/env bash
set -eu

touch tests/exec.rs
cargo test --test exec -- --ignored