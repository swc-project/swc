#!/usr/bin/env bash
set -eu


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

version="$1"
swc_core_version="$(cargo tree -i -p swc_core --depth 0 | awk '{print $2}')"

git pull || true
yarn

echo "Publishing $version with swc_core $swc_core_version"

# Update swc_core
(cd ./bindings && cargo upgrade -p swc_core --recursive false)


# Update version
npm version "$version" --no-git-tag-version --allow-same-version || true
(cd ./packages/minifier && npm version "$version" --no-git-tag-version --allow-same-version || true)
(cd ./bindings && cargo set-version $version -p binding_core_wasm -p binding_minifier_wasm)
(cd ./bindings && cargo set-version --bump patch -p swc_cli)


# Commmit and tag
git add -A
git commit -am "chore: Publish $version with swc_core $swc_core_version"
git tag -a -m "swc_core $swc_core_version" "v$version"


# Update changelog
yarn changelog
git add -A
git commit -m 'chore: Update changelog'

# Publish packages
git push
git push --tags
(cd ./bindings && cargo mono publish --no-verify)