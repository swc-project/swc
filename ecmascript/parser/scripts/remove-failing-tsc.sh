#!/usr/bin/env bash
set -eu

function prepend() { while read line; do echo "${1}${line}"; done; }

cargo test --test typescript \
    | grep ' ... FAILED' \
    | grep 'test spec_' \
    | sed -e 's/test spec_//' \
    | sed -e 's/ ... FAILED//' \
    | sed -e 's!__!/!g' \
    | sed -e 's!_d!.d!g' \
    | sed -e 's!_ts!.ts!g' \
    | prepend 'tests/' \
    | xargs rm -f


cargo test --test typescript \
    | grep ' ... FAILED' \
    | sed -e 's/test errors_typescript_errors__//' \
    | sed -e 's/ ... FAILED//' \
    | sed -e 's!__!/!g' \
    | sed -e 's!_d!.d!g' \
    | sed -e 's!_ts!.ts!g' \
    | prepend 'tests/typescript-errors/' \
    | xargs rm -f
