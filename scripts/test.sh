#!/usr/bin/env bash
set -eux


yarn run build:dev
yarn run tsc
# yarn test
npm link

mkdir -p tests/integration/three-js
swc tests/integration/three-js/repo/ -d tests/integration/three-js/build/
(cd tests/integration/three-js/build/test && qunit -r failonlyreporter unit/three.source.unit.js)