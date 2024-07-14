#!/usr/bin/env bash
set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

crate=$1

echo "Running cargo hack for crate $crate"

# yq query syntax is weird, so we have to use jq
json_str="$(yq -o=json $SCRIPT_DIR/../../tests.yml)"


if echo $json_str | jq -e ".check.\"$crate\"" > /dev/null; then
    check_commands=$(echo $json_str | jq -e -r ".check.\"$crate\" | .[]")

    while IFS= read -r line; do
        echo "    Running '$line'"
        (cd "crates/$crate" && $line)
    done <<< "$check_commands"
fi