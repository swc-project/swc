#!/usr/bin/env bash
set -eu

git pull || true

cargo mono bump $@
# Ensure that Cargo.lock is up-to-date
cargo metadata --format-version 1 > /dev/null
git add -A
git commit -m 'chore: Publish crates'
git push
cargo mono publish --no-verify