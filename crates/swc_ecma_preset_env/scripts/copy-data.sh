#!/usr/bin/env bash
set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

NM_DIR="$SCRIPT_DIR/../../../node_modules"

function data {
    mkdir -p "$(dirname $SCRIPT_DIR/../src/data/$1)"

    cp "$NM_DIR/$1" "$SCRIPT_DIR/../src/data/$1" 
}

data "@babel/compat-data/data/plugins.json"
