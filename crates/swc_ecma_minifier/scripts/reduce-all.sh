#!/usr/bin/env bash
set -eu


find ${1-"./inputs/"} -type f -name '*.js' -print0 | xargs -0 -I {} sh -c '\
    echo "Processing {}"
    ./scripts/reduce.sh {}'