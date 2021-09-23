#!/usr/bin/env bash
set -eu

cargo instruments --release -t time --features log/release_max_level_off --example perf