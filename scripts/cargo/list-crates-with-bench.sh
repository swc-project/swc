#!/usr/bin/env bash

set -eu

WS_CRATES=$(./scripts/cargo/get-workspace-crates-json.sh)

echo "$WS_CRATES" | jq -r '.[] | .name | select(.targets[] | .kind | contains(["bench"]))'
