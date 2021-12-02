#!/usr/bin/env bash
set -eu

./scripts/cargo/bump-with-cmd.sh "cargo mono bump $@" 