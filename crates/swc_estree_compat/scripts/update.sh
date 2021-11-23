#!/usr/bin/env bash

SCRIPT_DIR="`dirname "$0"`"

IFS='' # maintain whitespace
for filename in $SCRIPT_DIR/../src/ast/*.rs; do
    while read -r line; do
        [[ "$line" =~ ^[[:space:]]*$ ]] && continue
        [[ "$line" =~ ^[[:space:]]*# ]] && continue
        [[ "$line" =~ ^[[:space:]]*\/ ]] && continue
        echo "$line"
    done < "$filename"
done

