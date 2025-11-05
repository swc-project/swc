#!/usr/bin/env bash
##
## Usage:
## ./scripts/profile/samply.sh <crate> <benchmark> <test_name>
##
## - test_name is optional. If not provided, all tests will be profiled.
##
## Example:
## ./scripts/profile/samply.sh swc_ecma_parser parser cal
##

set -eu
export RUST_LOG=off

ddt profile samply cargo -p $1 --bench $2 --profile bench -- --bench ${3:-}