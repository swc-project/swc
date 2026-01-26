#!/usr/bin/env bash

set -eu

./scripts/build.sh
npx rstest $@

./scripts/build.sh --features nightly
npx rstest $@