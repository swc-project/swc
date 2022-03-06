#!/usr/bin/env bash
set -eu

git pull || true

yarn changelog
cargo mono bump -i
# Ensure that Cargo.lock is up-to-date
cargo metadata --offline --format-version 1 > /dev/null

# Ensure that dependencies are all verified
./scripts/crev/verify.sh

export GIT_COMMITTER_NAME="SWC Bot"
export GIT_COMMITTER_EMAIL="bot@swc.rs"

git add -A
git commit --author="SWC Bot <bot@swc.rs>" -m 'chore: Publish crates'
git push --no-verify
cargo mono publish --no-verify