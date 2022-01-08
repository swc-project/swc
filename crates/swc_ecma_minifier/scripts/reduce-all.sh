#!/usr/bin/env bash
set -eu

dir="${1-"./inputs/"}"

find $dir -type f -name '*.js' -print0 | xargs -0 -I {} sh -c '\
    echo "Processing {}"
    ./scripts/reduce.sh {}'


echo "Removing empty directories in $dir"

find $dir -type d -empty -delete
