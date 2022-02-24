#!/usr/bin/env bash
set -u

export UPDATE=1

cargo test -p swc -p swc_ecma_codegen -p swc_ecma_parser -p swc_bundler -p swc_node_bundler

git add -A
git commit -m 'Update test refs'