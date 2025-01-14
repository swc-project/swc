#!/usr/bin/env bash

set -eu

WS_CRATES=$(./scripts/cargo/get-workspace-crates-json.sh)
echo "$WS_CRATES" | jq -r -c '[.[] | select(.targets[] | (.kind | contains(["bench"])) and .name != "swc_plugin_runner") | .name] | unique'
