#!/usr/bin/env bash

find tests/tsc -type f -exec ./scripts/dos2unix.sh {} \;

