#!/usr/bin/env bash
#
# Script used to verify the dependencies of the project.
#

set -eu

./scripts/crev/verify.sh || true

echo "Opening the crate $1"

cargo crev crate diff $@ | code - --wait
cargo crev review $@ --diff
