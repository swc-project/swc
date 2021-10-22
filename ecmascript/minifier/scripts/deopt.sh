#!/usr/bin/env bash
set -u

cargo test --test compress deopt -- --nocapture
ls -al ./tests/full/private/deopt/output.js

