#!/usr/bin/env bash
set -eu

cargo instruments --release -t time --example gen --features tracing/release_max_level_off -- $@