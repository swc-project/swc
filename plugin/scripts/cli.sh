#!/usr/bin/env bash

## This script assumes `plugins` is in `$CDPATH`

set -eu

cargo install --path ./cli

swc-dev