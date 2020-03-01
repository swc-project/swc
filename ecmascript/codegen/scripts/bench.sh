#!/usr/bin/env bash

set -eux

rm -rf ../../target/release/bench-*

cargo bench --no-run --bench with_parse
# TODO:
#sudo flamegraph -- "../../target/release/bench-* --bench"