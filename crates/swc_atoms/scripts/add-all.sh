#!/usr/bin/env bash
set -eu

cargo run -p dbg-swc -- x print-atoms ../../node_modules/typescript/lib/lib.es2015.d.ts