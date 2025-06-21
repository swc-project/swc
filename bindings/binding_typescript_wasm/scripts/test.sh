#!/usr/bin/env bash

set -eu

./scripts/build.sh
npx jest $@

./scripts/build.sh --features nightly
npx jest $@