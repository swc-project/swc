#!/usr/bin/env bash
set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

$SCRIPT_DIR/sort.sh $SCRIPT_DIR/list-macosx.txt
$SCRIPT_DIR/sort.sh $SCRIPT_DIR/list-windows.txt


function prepend() { while read line; do echo "${1}${line}"; done; }

cargo metadata --format-version 1 \
 | jq -r '.workspace_members[]' \
 | cut -f1 -d" " \
 | sort