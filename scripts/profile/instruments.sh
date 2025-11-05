#!/usr/bin/env bash
##
## Usage:
## ./scripts/profile/instruments.sh <crate> <benchmark> <test_name>
##
## - test_name is optional. If not provided, all tests will be profiled.
##
## Example:
## ./scripts/profile/instruments.sh swc_ecma_parser parser cal
##

set -eu
export RUST_LOG=off

ddt profile instruments cargo -t time -p $1 --bench $2 --profile bench -- --bench ${3:-}