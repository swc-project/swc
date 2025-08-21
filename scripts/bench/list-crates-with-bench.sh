#!/usr/bin/env bash

set -eu

WS_CRATES=$(./scripts/cargo/get-workspace-crates-json.sh)
echo "$WS_CRATES" | jq -r -c '[.[] | select(.targets[] | .kind | contains(["bench"])) | .name] | sort | unique' | jq -r -c '[.[] | select(. != "swc_plugin_backend_tests" and . != "swc_allocator" and . != "swc")]'
