#!/usr/bin/env bash
set -u

UPDATE=1 cargo test --test compress deopt -- --nocapture
ls -al ./tests/full/private/deopt/output.js

