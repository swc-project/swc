#!/usr/bin/env bash
set -eu

cargo clippy --all -- --deny explicit_deref_methods --deny explicit_into_iter_loop --deny implicit_clone --deny inefficient_to_string --deny match_bool --deny print_stderr  --deny print_stdout