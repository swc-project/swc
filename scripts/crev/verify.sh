#!/usr/bin/env bash
#
# Script used to verify the depdencies of the project.
#

set -eu

# Exclude local crates.
TEXT="$(\
    cargo crev verify --show-latest-trusted --skip-verified --recursive |\
    grep -v "^local" |\
    grep -v "↑" |\
    grep -v "=[ ]*$" |\
    tee /dev/stderr \
)"

if [ ! -z "${1-}" ] ; then
    echo "Opening the crate $1"

    cargo crev open $@
    cargo crev review $@

else
    if [ ! -z "$TEXT" ]; then
        echo "Found a depenedncy requires verification"
        exit 1
    else
        echo "All dependencies are verified"
    fi
fi