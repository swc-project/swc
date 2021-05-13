#!/usr/bin/env bash
set -eu


./scripts/remove-failing-tsc.sh
./scripts/copy-ts-tests.ts ~/projects/TypeScript
./scripts/crlf.sh