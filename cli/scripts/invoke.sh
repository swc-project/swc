#!/usr/bin/env bash

set -eu

cargo install --path .

(cd plugins/packages/emotion && swc-dev $@)