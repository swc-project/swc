#!/usr/bin/env bash
set -eu


(cd next.js/packages/next-swc && yarn build-native)

(cd next.js && NEXT_PRIVATE_LOCAL_WEBPACK5=1 yarn next dev test/integration/production)
