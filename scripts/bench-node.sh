#!/usr/bin/env bash

set -eu


echo "Binary load time"
hyperfine --warmup 10 --runs 5 'node ./node-swc/benches/load.mjs'