#!/usr/bin/env bash

# Iterate over arguments, check if it's release build
export BUILD_TARGET="debug"
for var in "$@"
do
  if [ "$var" = "--release" ]; then
    export BUILD_TARGET="release"
  fi
done

# Build wasm binary
cargo build $@ --target=wasm32-unknown-unknown

# Build polyfill cli, run polyfill over generated wasm binary
pushd multivalue-polyfill
cargo build
cargo run -- $BUILD_TARGET
popd
