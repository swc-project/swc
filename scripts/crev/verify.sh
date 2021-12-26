#!/usr/bin/env bash
#
# Script used to verify the depdencies of the project.
#

set -eu

# Exclude local crates.
cargo crev verify --show-latest-trusted --skip-verified --recursive |\
    grep -v "^local"

if [ ! -z "${1-}" ] ; then
    echo "Opening the crate $1"

    cargo crev open $@
    cargo crev review $@
fi