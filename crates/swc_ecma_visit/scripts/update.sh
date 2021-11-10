#!/usr/bin/env bash


for filename in ../ast/src/*.rs; do
#    echo "$filename"
    while read -r line; do
      [[ "$line" =~ ^[[:space:]]*# ]] && continue
      [[ "$line" =~ ^[[:space:]]*\/ ]] && continue
      [[ "$line" =~ ^[[:space:]]*\/ ]] && continue
      echo "$line"
    done < "$filename"

done