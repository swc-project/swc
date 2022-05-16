#!/usr/bin/env bash
set -eu

find .input -type f | xargs -L 1 -I {} cargo run --release -- minify reduce --mode size '{}'; rm '{}'
# mv data/*.js ./.input/