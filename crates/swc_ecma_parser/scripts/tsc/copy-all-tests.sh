#!/usr/bin/env bash
#
# Usage: `./scripts/tsc/copy-all-tests.sh ~/projects/TypeScript`
#

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

set -eu

find "$1/tests/cases/conformance" -type f | xargs -P 8 -L 1 -I {} "$SCRIPT_DIR/copy-test.ts" {} \;