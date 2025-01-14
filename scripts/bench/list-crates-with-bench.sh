#!/usr/bin/env bash

set -eu

WS_CRATES=$(./scripts/cargo/get-workspace-crates-json.sh)
echo "$WS_CRATES" | jq -r -c '[.[] | select(.targets[] | .name != "swc_plugin_runner" and .targets[] | .kind | contains(["bench"])) | .name] | unique'
