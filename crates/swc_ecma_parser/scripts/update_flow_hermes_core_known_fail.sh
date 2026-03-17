#!/usr/bin/env bash
set -euo pipefail

UPDATE_FLOW_HERMES_CORE_KNOWN_FAIL=1 \
  cargo test -p swc_ecma_parser --test flow_hermes --features flow -- --nocapture
