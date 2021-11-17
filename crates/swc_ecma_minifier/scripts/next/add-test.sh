#!/usr/bin/env bash
set -eu

# Usage: Invoke this script using full path from a next app.

export NEXT_DEBUG_MINIFY=1

# Remove preovious builds
rm -r .next


npx next build | grep '{ name:'