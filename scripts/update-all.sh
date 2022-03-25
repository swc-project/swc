#!/usr/bin/env bash
set -u

export UPDATE=1
export DIFF=0

function up(){
    cargo test -p swc -p swc_ecma_codegen -p swc_ecma_parser -p swc_bundler -p swc_node_bundler --no-fail-fast
}

up


git add -A
git commit -m 'Update test refs'
git push -u origin "$(git rev-parse --abbrev-ref HEAD)" --no-verify