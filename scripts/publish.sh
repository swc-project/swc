#!/usr/bin/env bash
set -eux


version="$1"


npm version "$version" --no-git-tag-version
(cd ./bindings && cargo set-version $version -p binding_core_wasm)