#!/usr/bin/env bash
set -eu

git pull || true

yarn changelog
cargo mono bump -i
# Ensure that Cargo.lock is up-to-date
cargo metadata --offline --format-version 1 > /dev/null
git add -A
git commit -m 'chore: Publish crates'
git push
cargo mono publish --no-verify