#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# yarn run cspell "**/src/**/*.rs"
cargo fmt --all -- --check

# Remove empty directories
if command -v fd &> /dev/null
then
    fd -H '^\.DS_Store$' -tf -X rm || true
    fd -te -td -X rmdir || true
fi

