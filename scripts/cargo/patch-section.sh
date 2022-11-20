#!/usr/bin/env bash

set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

function toLine {
    dir="$(dirname $2)"
    echo "$1 = { path = '$dir' }"
}

export -f toLine

$SCRIPT_DIR/list-crates.sh | jq '[.name, .manifest_path] | @csv' -r | xargs -I {} bash -c 'toLine "$@"' _ {}