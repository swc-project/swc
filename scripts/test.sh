#!/usr/bin/env bash
set -eu


yarn run build:dev
yarn run tsc
yarn test