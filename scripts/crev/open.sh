#!/usr/bin/env bash
#
# Script used to verify the depdencies of the project.
#

set -eu


./scripts/crev/verify.sh || true

echo "Opening the crate $1"

cargo crev open $@
cargo crev review $@