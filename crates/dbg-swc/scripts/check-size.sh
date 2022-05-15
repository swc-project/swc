#!/usr/bin/env bash
set -eu

# cargo run -- minify ensure-size --no-terser $1 > list.txt
cat list.txt | xargs -L 1 cargo run --release -- minify reduce