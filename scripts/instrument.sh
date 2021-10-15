#!/usr/bin/env bash
set -eu

cargo instruments --release -t time --bench typescript --features tracing/release_max_level_off $@