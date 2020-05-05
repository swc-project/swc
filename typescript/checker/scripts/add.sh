#!/bin/bash
set -eu

#
# Usage: ./scripts/run.sh "types/never"
#

cargo fmt
#cargo check

if [[ $1 != *:: ]] && [[ $1 != *\.ts ]] && [[ ! -z $1 ]]; then
  echo 'Wrong invokation. Argument must empty or end with "::" or ".ts"'
  exit 1
fi

bash ./scripts/sort.sh
./scripts/success.py


# Verify tests mark as done
TEST="DONE" DBG_ERROR="" RUST_BACKTRACE=0 cargo test --test tests -- conformance
reset
echo "Tests marked as done are verified"

# We are developing
export TEST="$1"
if [[ -z $1 ]]; then
  cargo test --test tests -- conformance
else
  ( set -o pipefail; cargo test --test tests -- conformance | grep --color -E 'swc_ecma_ast|swc_ts_checker|$' )
fi

echo "$1" >> ./tests/done.txt
bash ./scripts/sort.sh
./scripts/success.py