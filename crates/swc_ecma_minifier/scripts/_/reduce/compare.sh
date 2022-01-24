#!/usr/bin/env bash
set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

"$MINIFY" input.js
$SCRIPT_DIR/compare.js input.js output.js
