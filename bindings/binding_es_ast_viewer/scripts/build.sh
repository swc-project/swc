#!/usr/bin/env bash
set -eux

# On macOS, disable wasm-opt due to LLVM compatibility issues
# See: https://github.com/WebAssembly/wasi-sdk/issues/254
# See: https://github.com/llvm/llvm-project/issues/64909
EXTRA_ARGS=""
if [[ "$OSTYPE" == "darwin"* ]]; then
    EXTRA_ARGS="--no-opt"
fi

wasm-pack build --out-name es_ast_viewer --release --scope=swc --target web $EXTRA_ARGS $@
ls -al ./pkg

node ./scripts/package.mjs