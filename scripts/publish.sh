#!/usr/bin/env bash
set -eu


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

git pull || true
yarn

version="$1"
swc_core_version="$(cargo tree -i -p swc_core --depth 0 | awk '{print $2}')"

echo "Publishing $version with swc_core $swc_core_version"

# Update swc_core
(cd ./bindings && ../scripts/update-all-swc-crates.sh || true)


# Update version
(cd ./packages/core && npm version "$version" --no-git-tag-version --allow-same-version || true)
(cd ./packages/html && npm version "$version" --no-git-tag-version --allow-same-version || true)
(cd ./packages/minifier && npm version "$version" --no-git-tag-version --allow-same-version || true)
(cd ./bindings && cargo set-version $version -p binding_core_wasm -p binding_minifier_wasm -p binding_typescript_wasm)
(cd ./bindings && cargo set-version --bump patch -p swc_cli)


# Commmit and tag
git add -A
git commit -am "chore: Publish \`$version\` with \`swc_core\` \`$swc_core_version\`"
git tag -a -m "swc_core $swc_core_version" "v$version"


# Update changelog
yarn changelog
git add -A || true
git commit -m 'chore: Update changelog' || true

# Publish packages
git push git@github.com:swc-project/swc.git --no-verify
git push git@github.com:swc-project/swc.git --no-verify --tags