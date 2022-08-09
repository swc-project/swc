#!/usr/bin/env bash
set -u

export UPDATE=1
export DIFF=0

function crate() {
    until cargo test -p $1 --no-fail-fast
    do
        git add -A
        git commit -m 'Update test refs'
    done
    
    git add -A
    git commit -m 'Update test refs'
}

crate swc
crate swc_ecma_codegen
crate swc_ecma_parser
crate swc_bundler
crate swc_node_bundler
crate swc_ecma_transforms_react

git push -u origin "$(git rev-parse --abbrev-ref HEAD)" --no-verify