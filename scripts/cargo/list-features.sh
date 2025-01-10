#!/usr/bin/env bash

set -eu



# Prints json for workspace crates

cargo metadata --format-version 1 | jq -r '.packages[] | select(.source == null and .name == "'$1'") | .features'