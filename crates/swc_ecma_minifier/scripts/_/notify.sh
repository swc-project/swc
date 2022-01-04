#!/usr/bin/env bash
set -eu


if command -v osascript &> /dev/null
then
    osascript -e "display alert \"$1\""
fi
