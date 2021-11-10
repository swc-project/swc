#!/usr/bin/env bash

find ./fixtures -type d -empty -delete

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

python3 $SCRIPT_DIR/del.py