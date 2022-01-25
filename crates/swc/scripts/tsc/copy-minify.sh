#!/usr/bin/env bash
set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

git diff --name-only | xargs -L 1 -I {} $SCRIPT_DIR/copy-minify-file.sh {} \;