#!/usr/bin/env bash
set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

crates=$(\
    cargo metadata --format-version 1 \
        | jq -r '.workspace_members[]' \
        | cut -f1 -d" " \
        | sort \
)

for crate in $crates
do
    cargo publish -p $crate --dry-run --no-verify -v || true
done