#!/usr/bin/env bash
#
# Used to generate `swc-bump`
set -eu


git diff --name-only HEAD upstream/main | grep -E '^crates/' | sed -e "s/^crates\///" | sed 's/\/.*//' | uniq