#!/usr/bin/env bash

set -eu

cargo install --path . --debug
export RUST_LOG=debug

(cd plugins/packages/jest && swd $@)