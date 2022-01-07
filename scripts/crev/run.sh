#!/usr/bin/env bash
#

set -eu

cargo crev verify --show-latest-trusted --skip-verified --recursive |\
    grep -v "^local" |\
    grep -v "↑" |\
    grep -v "=[ ]*$" |\
    tee /dev/stderr