#!/usr/bin/env bash
set -eu

cargo metadata --format-version 1 --no-deps | jq '[.packages[] | select(.source == null and .name != "xtask") | .name]'