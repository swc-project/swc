#!/usr/bin/env bash

## This script assumes `plugins` is in `$CDPATH`

set -eu

(cd plugins && cargo build && ls -al target/debug)

export PLUGINS_DIR=$(cd plugins > /dev/null && pwd)
echo "Using plugins at $PLUGINS_DIR"

(cd runner && cargo test)