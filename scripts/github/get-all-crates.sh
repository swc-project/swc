#!/usr/bin/env bash
set -eu

function prepend() { while read line; do echo "${1}${line}"; done; }

cargo metadata --format-version 1 \
 | jq -r '.workspace_members[]' \
 | cut -f1 -d" " \
 | sort \
 | prepend '- '
