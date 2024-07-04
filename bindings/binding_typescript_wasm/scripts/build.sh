#!/usr/bin/env bash
set -eux

wasm-pack build --out-name wasm --release --scope=swc --target nodejs
ls -alH ./pkg
node ./scripts/patch.mjs