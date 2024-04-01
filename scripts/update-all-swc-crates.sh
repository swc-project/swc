#!/usr/bin/env bash

set -eu

echo "Listing all swc crates"

swc_crates=$(cargo metadata --format-version=1 --all-features | jq '.packages .[] | select(.repository == "https://github.com/swc-project/swc.git" or .repository == "https://github.com/swc-project/plugins.git") | .name' -r)

command="cargo update"
for crate in $swc_crates; do
  command="$command -p $crate"
done

echo "Running: $command"
eval $command

all_direct_deps=$(cargo metadata --format-version=1  --all-features | jq -r '.packages[] | select(.source == null) | .dependencies .[] .name' -r)

direct_swc_deps=$(comm -12 <(echo "$swc_crates" | sort) <(echo "$all_direct_deps" | sort))

command="cargo upgrade --incompatible --recursive false"
for crate in $direct_swc_deps; do
  command="$command -p $crate"
done

echo "Running: $command"
eval $command