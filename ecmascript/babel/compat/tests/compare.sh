#!/usr/bin/env bash

# Print a side by side comparison of Babel and SWC AST.
SCRIPT_DIR=`dirname "$0"`

paste <(node "$SCRIPT_DIR/babelgen.js" $1) <(node "$SCRIPT_DIR/swcgen.js" $1) | column -s $'\t' -t
