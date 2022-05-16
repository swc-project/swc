#!/usr/bin/env bash
set -eu

cargo run --release -- minify reduce --mode size --remove $1
# mv data/*.js ./.input/