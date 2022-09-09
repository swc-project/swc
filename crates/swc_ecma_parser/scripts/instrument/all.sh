#!/usr/bin/env bash
set -eu

#!/usr/bin/env bash
#
# This instruments whole input directory
#
# Usage:
#
#   ./scripts/instrument/all.sh path/to/dir

export RUST_LOG=off
export MIMALLOC_SHOW_STATS=1

cargo profile instruments -t time --example parse-all --release -- $@