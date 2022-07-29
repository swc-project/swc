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
(cd ./packages/next-swc && pnpm build-native)

echo "----- ⚠️  Removing cache"
(cd $dir && rm -rf .next)

echo "----- ⚠️  Replacing swc binary"
mv packages/next-swc/native/*.node $dir/../node_modules/@next/swc-*/
ls -alh $dir/../node_modules/@next/swc-*/

# Build and start
echo "----- ⚠️  Building the app using next"
(cd $dir && npx next build)
(cd $dir && npx next start)