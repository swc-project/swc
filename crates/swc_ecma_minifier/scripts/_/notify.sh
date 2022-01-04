#!/usr/bin/env bash
set -eu


if command -v osascript &> /dev/null
then
    osascript -e "display notification \"$1\" with title \"swc-minifier\""
fi
