#!/usr/bin/env bash
set -eux


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

version="$1"

git commit $SCRIPT_DIR/publish.sh -m 'Update publish script'
git reset --hard

npm version "$version" --no-git-tag-version
(cd ./bindings && cargo set-version $version -p binding_core_wasm)
