#!/usr/bin/env bash
set -eu

cargo mono bump $@
# Ensure that Cargo.lock is up-to-date
cargo metadata --format-version 1 > /dev/null
git add -A
git commit -m 'chore: Publish crates'