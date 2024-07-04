#!/usr/bin/env bash
set -eux

wasm-pack build --out-name wasm --release --scope=swc --target nodejs
ls -al ./pkg
node ./scripts/patch.mjs