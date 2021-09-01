#!/usr/bin/env bash
set -eu


yarn run build:dev
yarn run tsc
yarn test

swc --sync tests/integration/three-js/repo/ -d tests/integration/three-js/build/
(cd tests/integration/three-js/build/test && qunit -r failonlyreporter unit/three.source.unit.js)