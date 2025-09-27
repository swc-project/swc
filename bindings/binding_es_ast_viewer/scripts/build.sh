#!/usr/bin/env bash
set -eux

wasm-pack build --out-name es_ast_viewer --release --scope=swc --target web $EXTRA_ARGS $@
ls -al ./pkg

node ./scripts/package.mjs