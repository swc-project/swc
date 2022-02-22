#!/usr/bin/env bash
set -eu

cargo clippy --all -- --deny explicit_deref_methods --deny explicit_into_iter_loop