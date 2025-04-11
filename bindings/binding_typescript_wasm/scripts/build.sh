#!/usr/bin/env bash
set -eux

export CARGO_PROFILE_RELEASE_LTO="fat"
export CARGO_PROFILE_RELEASE_OPT_LEVEL="z"
wasm-pack build --out-name wasm  --scope=swc --target nodejs
ls -al ./pkg

node ./scripts/patch.mjs
