#!/usr/bin/env bash
set -eu

find .input -type f | xargs -L 1 -I {} cargo run --release -- minify reduce '{}'
# mv data/*.js ./.input/