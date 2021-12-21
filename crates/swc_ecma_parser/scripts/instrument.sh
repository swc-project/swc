#!/usr/bin/env bash
set -eu

cargo profile instruments --release -t time --features log/release_max_level_info --example perf