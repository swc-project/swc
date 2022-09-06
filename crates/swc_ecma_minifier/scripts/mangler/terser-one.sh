#!/usr/bin/env bash
#
# Generates reference output for the mangler, using terser
# 
set -eu

output="${1/input/output.mangleOnly}"
npx terser --mangle --toplevel --output "$output" $1
npx prettier --write "$output"