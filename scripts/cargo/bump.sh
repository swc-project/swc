#!/usr/bin/env bash
set -eu

git pull || true

yarn changelog
cargo mono bump -i
# Ensure that Cargo.lock is up-to-date
cargo metadata --format-version 1 > /dev/null
(cd ./bindings && cargo metadata --format-version 1 > /dev/null)

# Ensure that dependencies are all verified
./scripts/crev/verify.sh

git add -A
git commit -m 'chore: Publish crates'
git push --no-verify

# Publish
cargo mono publish --no-verify
(cd ./bindings && cargo mono publish --no-verify)
