#!/usr/bin/env bash
set -eu

cargo run --release -- minify reduce --mode size --remove .input
# mv data/*.js ./.input/