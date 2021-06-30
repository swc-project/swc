#!/usr/bin/env bash
set -eu

touch tests/compress.rs

UPDATE=1 cargo test --test compress projects
UPDATE=1 cargo test --test compress projects