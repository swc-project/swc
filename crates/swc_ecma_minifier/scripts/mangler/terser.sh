#!/usr/bin/env bash
#
# Generates reference output for the mangler, using terser
# 
set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

find ./tests/terser -name 'input.js' | xargs -L 1 -P 16 -I {} $SCRIPT_DIR/terser-one.sh {} \;