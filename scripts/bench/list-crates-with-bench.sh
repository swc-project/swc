#!/usr/bin/env bash

set -eu

WS_CRATES=$(./scripts/cargo/get-workspace-crates-json.sh)
echo "$WS_CRATES" | jq '[.[] | select(.targets[] | .kind | contains(["bench"])) | .name]'
