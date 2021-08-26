#!/usr/bin/env bash
set -eu

yarn run build:dev
yarn link

(cd swr && yarn run build)