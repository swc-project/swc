#!/usr/bin/env bash
set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

function prepend() { while read line; do echo "${1}${line}"; done; }

crates=$(\
    cargo metadata --format-version 1 \
        | jq -r '.workspace_members[]' \
        | cut -f1 -d" " \
        | sort \
)

for crate in $crates
do
    echo "- crate: $crate"
    echo "  os: ubuntu-latest"

    if grep -q "^$crate\$" "$SCRIPT_DIR/list-macos.txt"; then
        echo "- crate: $crate"
        echo "  os: macos-latest"
    fi

    if grep -q "^$crate\$" "$SCRIPT_DIR/list-windows.txt"; then
        echo "- crate: $crate"
        echo "  os: windows-latest"
    fi
done