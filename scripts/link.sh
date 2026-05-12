#!/usr/bin/env bash
set -eu

pnpm build:dev
pnpm link --global

(cd swr && pnpm build)
