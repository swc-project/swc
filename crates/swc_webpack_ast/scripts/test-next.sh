#!/usr/bin/env bash
set -eu

# This script tests if webpack ast is identical to webpack ast produced by acorn,
# by running webpack via next.js

export RUST_BACKTRACE=1

cargo test --no-run
UPDATE=1 cargo test -q

(cd next.js/packages/next-swc && yarn build-native)

# (cd next.js && NEXT_PRIVATE_LOCAL_WEBPACK5=1 yarn next dev test/integration/production)
(cd next.js && NEXT_PRIVATE_LOCAL_WEBPACK5=1 yarn testheadless)
