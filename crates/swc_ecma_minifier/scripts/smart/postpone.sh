#!/usr/bin/env bash
set -eu

find tests/compress/exec -name output.js | xargs -L 1 rm
find tests/compress/exec -name expected.stdout | xargs -L 1 rm
find tests/compress/exec -name output.terser.js | xargs -L 1 rm
find tests/compress/exec -name mangle.json | xargs -L 1 rm
find tests/compress/exec -empty -type d -delete

./scripts/run.sh \
    | grep 'base_exec_compress__exec__terser__' \
    | grep '__input_js ... ok' \
    | sed -e 's/test base_exec_compress__exec__terser__//' \
    | sed -e 's/__input_js ... ok//' \
    | xargs -L 1 ./scripts/postpone.sh

./scripts/run.sh