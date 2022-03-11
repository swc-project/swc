#!/usr/bin/env bash
set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

NM_DIR="$SCRIPT_DIR/../../../node_modules"

function data {
    echo "es/preset-env: Copying $1"

    mkdir -p "$(dirname $SCRIPT_DIR/../data/$1)"

    cp "$NM_DIR/$1" "$SCRIPT_DIR/../data/$1" 
}

data "@babel/compat-data/data/plugins.json"
data "@babel/compat-data/data/plugin-bugfixes.json"
data "core-js-compat/data.json"
data "core-js-compat/entries.json"
data "core-js-compat/modules-by-versions.json"