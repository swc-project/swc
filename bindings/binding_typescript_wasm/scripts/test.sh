#!/usr/bin/env bash

set -eu

./scripts/build.sh
./scripts/build-nodejs-support.sh
npx rstest $@

./scripts/build.sh --features nightly
WASM_FEATURES=nodejs-support,nightly ./scripts/build-nodejs-support.sh
npx rstest $@
