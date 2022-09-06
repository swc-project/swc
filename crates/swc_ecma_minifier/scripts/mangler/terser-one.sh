#!/usr/bin/env bash
#
# Generates reference output for the mangler, using terser
# 
set -eu

npx terser --mangle --output "${1/input/output.mangleOnly}" $1