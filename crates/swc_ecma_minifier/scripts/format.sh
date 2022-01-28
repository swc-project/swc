#!/usr/bin/env bash
set -eux

# Make it easier to compare
prettier --write $1
yarn run eslint --fix $1