#!/usr/bin/env bash
set -eu

./scripts/run.sh \
    | grep 'base_exec_compress__exec__terser__' \
    | grep '__input_js ... ok' \
    | sed -e 's/test base_exec_compress__exec__terser__//' \
    | sed -e 's/__input_js ... ok//' \
    | xargs -L 1 ./scripts/postpone.sh

./scripts/run.sh