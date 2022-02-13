#!/usr/bin/env bash
set -eu

cargo profile instruments --release -t time --features tracing/release_max_level_info --example minifier -- $@