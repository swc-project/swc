#!/usr/bin/env bash
#
# Script used to verify the dependencies of the project.
#

set -eu

# Exclude local crates.
TEXT="$(./scripts/crev/run.sh)"

if [ ! -z "${1-}" ] ; then
    echo "Opening the crate $1"

    cargo crev open $@
    cargo crev review $@

else
    if [ ! -z "$TEXT" ]; then
        echo "Found a dependency requires verification"
        # exit 1
    else
        echo "All dependencies are verified"
    fi
fi
