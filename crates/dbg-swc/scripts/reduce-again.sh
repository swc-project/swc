#!/usr/bin/env bash
set -eu

ls .input | xargs -L 1 -I {} cargo run --release -- minify reduce './.input/{}'
# mv data/*.js ./.input/