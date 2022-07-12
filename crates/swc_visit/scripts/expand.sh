#!/usr/bin/env bash
set -eu


export DBG_DUMP=1

cargo expand --features path --test vec_opt > tests/expanded.rs