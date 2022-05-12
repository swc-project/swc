#!/usr/bin/env bash
set -eu

mkdir -p ./target/bins

cargo nextest list --list-type binaries-only --message-format json > target/bins/binaries-metadata.json

cat target/bins/binaries-metadata.json | \
    jq -r '."rust-binaries" | .[]."binary-path"' | \
    xargs -I {} cp {} ./target/bins

ls -alh ./target/bins