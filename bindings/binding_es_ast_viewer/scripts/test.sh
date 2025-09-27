#!/usr/bin/env bash

set -eu

export NODE_OPTIONS="--experimental-require-module --experimental-vm-modules";

./scripts/build.sh
npx jest $@
