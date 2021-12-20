#!/usr/bin/env bash
#
# This script counts the number of files per each directory.
#
#
set -eu

find . -type d -empty -delete

find . -maxdepth 3 -mindepth 1 -type d | while read dir; do
    if [[ $dir == ./.git* ]]; then
        continue
    fi

    if git check-ignore "$dir" > /dev/null ; then
        # echo "Ignoring $dir"
        continue
    fi

    echo "Directory: $dir"
    echo "Dir: $(find $dir -type d | wc -l)"
    echo "File: $(find $dir -type f | wc -l)"
done