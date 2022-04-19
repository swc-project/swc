#!/usr/bin/env bash
#
# Usage:
# 
#   From your clone of next.js, you can invoke this script like
#
#       /absolute/path/to/this/script.sh examples/foo
#
# This script will
#
#  - build native binary (`next-swc`)
#  - install dependnecies using `yarn``
#  - remove some dependencies (`next`, `react`, `react-dom`)
#  - yarn next build examples/foo
#  - yarn next start examples/foo
set -eu

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

dir="$1"
nextJsDir="$(pwd)"

# Ensure that next-swc is up to date
echo "----- ⚠️  Building next-swc"
(cd ./packages/next-swc && yarn build-native)

# Install dependencies
echo "----- ⚠️  Installing dependencies"
if test -f "$dir/yarn.lock"; then
    echo "  Using yarn"
    (cd $dir && yarn)
else
    echo "  Using yarn"
    (cd $dir && npm ci)
fi

echo "----- ⚠️  Removing cache"
(cd $dir && rm -rf .next)

# Remove some packages
(cd $dir && rm -rf node_modules/next)
(cd $dir && rm -rf node_modules/next)
(cd $dir && rm -rf node_modules/react-dom)

# Build and start
yarn next build $dir
yarn next start $dir