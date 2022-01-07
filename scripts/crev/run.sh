#!/usr/bin/env bash
set -eu

cargo metadata --offline --format-version 1 > /dev/null

cargo crev verify --show-latest-trusted --skip-verified --recursive |\
    grep -v "^local" |\
    grep -v "↑" |\
    grep -v "=[ ]*$" |\
    tee /dev/stderr