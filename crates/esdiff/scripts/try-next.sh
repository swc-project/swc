#!/usr/bin/env bash
set -eu

./scripts/install.sh

esdiff reduce-min --build 'rm -rf .next && npx next build' --test '' $@