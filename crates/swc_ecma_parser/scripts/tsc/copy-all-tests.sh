#!/usr/bin/env bash
#
# Usage: `./scripts/tsc/copy-all-tests.sh ~/projects/TypeScript`
#

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

set -eu

npx tsc ./scripts/tsc/copy-test.ts

find "$1/tests/cases/conformance" -type f | sort -R | xargs -P 10 -L 1 -I {} node "$SCRIPT_DIR/copy-test.js" {} \;