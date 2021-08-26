#!/usr/bin/env bash

set -eux

cargo test --test ex
# (cd ../examples/drop_console && wasm-pack build --debug)

ls -al ../examples/drop_console/target/wasm32-wasi/debug/