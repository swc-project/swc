#!/usr/bin/env bash

set -eu

cargo install --path .
export RUST_LOG=debug

(cd plugins/packages/emotion && swc-dev $@)