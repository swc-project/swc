#!/usr/bin/env bash
#
# Script used to verify the depdencies of the project.
#

set -eu


cargo crev verify --skip-verified --recursive | grep 'none'

echo "Opening the crate $1"

cargo crev open $1
cargo crev review $1