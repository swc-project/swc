#!/usr/bin/env bash
set -eu

cargo run --release -- minify reduce --mode semantics --remove $1
# mv data/*.js ./.input/