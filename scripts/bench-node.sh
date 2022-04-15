#!/usr/bin/env bash

set -eu


echo "Binary load time"
hyperfine --warmup 10 --runs 5 'node ./node-swc/benches/load.mjs'

echo "Load + minify antd, all core"
hyperfine --warmup 5 --runs 5 "node ./node-swc/benches/minify.mjs $PWD/crates/swc_ecma_minifier/benches/full/antd.js"

echo "Load + minify antd, 2 core"
hyperfine --warmup 5 --runs 5 "RAYON_NUM_THREADS=2 node ./node-swc/benches/minify.mjs $PWD/crates/swc_ecma_minifier/benches/full/antd.js"

