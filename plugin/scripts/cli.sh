#!/usr/bin/env bash

set -eu

cargo install --path ./cli

(cd plugins && swc-dev $@)