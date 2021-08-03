#!/usr/bin/env bash
set -eu

git status -u --porcelain \
    | grep '?? ecmascript/codegen/tests' \
    | sed -e 's!^?? ecmascript/codegen/!!' \
    | xargs -L 1 ./scripts/compare-file.sh