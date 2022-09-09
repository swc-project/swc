#!/usr/bin/env bash
set -u

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

function prepend() { while read line; do echo "${1}${line}"; done; }

crates=$(\
    cargo metadata --format-version 1 \
        | jq -r '.workspace_members[]' \
        | cut -f1 -d" " \
        | sort \
)

# yq query syntax is weird, so we have to use jq
json_str="$(yq -o=json $SCRIPT_DIR/tests.yml)"

for crate in $crates
do
    echo "- crate: $crate"
    echo "  os: ubuntu-latest"

    if echo $json_str | jq -e "select(.host.\"$crate\")" > /dev/null; then
        echo "  runner: " `echo $json_str | jq -e -r ".host.\"$crate\""`
        
    else
        echo "  runner: ubuntu-latest"
    fi

    if echo $json_str | jq -e ".check.\"$crate\"" > /dev/null; then
        echo "  check: |"

        check_commands=$(echo $json_str | jq -e -r ".check.\"$crate\" | .[]")

        while IFS= read -r line; do
            echo "    $line"
        done <<< "$check_commands"
    fi

    
    if echo $json_str | jq -e "select(.os.macos | index(\"$crate\"))" > /dev/null; then
        echo "- crate: $crate"
        echo "  os: macos-latest"
        echo "  runner: macos-latest"
    fi

    if echo $json_str | jq -e "select(.os.windows | index(\"$crate\"))" > /dev/null; then
        echo "- crate: $crate"
        echo "  os: windows-latest"
        echo "  runner: windows-latest"
    fi
done