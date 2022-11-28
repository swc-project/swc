#!/usr/bin/env bash

set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

function toLine {
    # >&2 echo "toLine: $@"
    arr=(${1//,/ })
    # >&2 echo "arr: ${arr[0]} ${arr[1]}"
    dir="$(dirname ${arr[1]})"
    echo "${arr[0]} = { path = '$dir' }"
}

export -f toLine

$SCRIPT_DIR/list-crates.sh | jq '[.name, .manifest_path] | @csv' -r | xargs -I {} bash -c 'toLine "$@"' _ {}