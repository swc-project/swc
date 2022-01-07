#!/usr/bin/env bash
set -eu

cargo metadata --format-version 1 > /dev/null

cargo crev verify --show-latest-trusted --skip-verified |\
    grep -v "^local" |\
    grep -v "↑" |\
    grep -v "=[ ]*$" |\
    tee /dev/stderr