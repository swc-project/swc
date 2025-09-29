#!/usr/bin/env bash
set -eux

wasm-pack build --out-name es_ast_viewer --release --scope=swc --target web $@
ls -al ./pkg

node ./scripts/package.mjs