#!/usr/bin/env bash

set -eu

wasm-pack build --out-name wasm --release --scope=swc --target nodejs
npx jest $@