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

# Ensure that next-swc is up to date
(cd ./packages/next-swc && yarn build-native)

# Install dependencies
if test -f "$dir/yarn.lock"; then
    (cd $dir && yarn)
else
    (cd $dir && npm ci)
fi

# Remove some packages
(cd $dir && rm -rf node_modules/react)
(cd $dir && rm -rf node_modules/next)
(cd $dir && rm -rf node_modules/react-dom)

# Build and start
yarn next build $dir
yarn next start $dir