#!/usr/bin/env bash

set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

function toLine {
    arr=(${1//\\\t/ })
    dir="$(dirname ${arr[1]})"
    echo "${arr[0]} = { path = '$dir' }"
}

export -f toLine

$SCRIPT_DIR/list-crates.sh | jq '[.name, .manifest_path] | @tsv' | xargs -L 1 -I {} bash -c 'toLine "$@"' _ {}