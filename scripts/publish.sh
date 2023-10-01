#!/usr/bin/env bash
set -eux


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

version="$1"

# Reset other changes
git commit $SCRIPT_DIR/publish.sh -m 'Update publish script' || true
git reset --hard

# Update version

npm version "$version" --no-git-tag-version
(cd ./bindings && cargo set-version $version -p binding_core_wasm)
(cd ./bindings && cargo set-version --bump patch -p swc_cli)

# Update swc_core

(cd ./bindings && cargo upgrade -p swc_core --help)