#!/usr/bin/env bash
set -eu

cargo instruments --release -t time --open --features tracing/release_max_level_off --example perf -- $@