#!/usr/bin/env bash

find tests/tsc -type f -exec ./scripts/dos2unix.sh {} \;
find tests/typescript -type f -exec ./scripts/dos2unix.sh {} \;
find tests/typescript-errors -type f -exec ./scripts/dos2unix.sh {} \;

