#! /bin/bash

# Print a side by side comparison of Babel and SWC AST.
SCRIPT_DIR=`dirname "$0"`

paste <(node "$SCRIPT_DIR/genbabel.js" $1) <(node "$SCRIPT_DIR/genswc.js" $1) | column -s $'\t' -t
