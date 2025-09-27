#!/usr/bin/env bash

set -eu

./scripts/build.sh

export NODE_OPTIONS="--experimental-require-module --experimental-vm-modules";
npx jest $@
