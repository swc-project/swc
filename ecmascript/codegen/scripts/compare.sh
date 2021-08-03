#!/usr/bin/env bash
set -eu

find tests/test262-min -name '*.js' | xargs -L 1 ./scripts/compare-file.sh
find tests/fixture -name 'output.js' | xargs -L 1 ./scripts/compare-file.sh