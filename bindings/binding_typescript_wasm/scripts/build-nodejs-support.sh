#!/usr/bin/env bash
set -eux

export CARGO_PROFILE_RELEASE_LTO="fat"
export CARGO_PROFILE_RELEASE_OPT_LEVEL="z"

wasm-pack build \
  --out-name wasm \
  --out-dir nodejs-support \
  --release \
  --scope=swc \
  --target nodejs \
  --features "${WASM_FEATURES:-nodejs-support}" \
  "$@"
ls -al ./nodejs-support

node ./scripts/patch.mjs \
  nodejs-support \
  @swc/nodejs-support-wasm \
  "SWC WebAssembly helpers for Node.js"
cp ./README.nodejs-support.md ./nodejs-support/README.md
