#!/usr/bin/env bash

set -eu

echo "Listing all swc crates"

crates=$(cargo metadata --format-version=1 | jq '.packages .[] | select(.repository == "https://github.com/swc-project/swc.git") | .name')

command="cargo upgrade --incompatible --recursive false"
for crate in $crates; do
  command="$command -p $crate"
done

echo "Running: $command"
eval $command