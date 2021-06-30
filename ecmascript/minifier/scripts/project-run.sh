#!/usr/bin/env bash
set -eu

UPDATE=1 cargo test --test compress projects
UPDATE=1 cargo test --test compress projects