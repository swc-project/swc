#!/usr/bin/env bash

find tests/tsc -type f -exec ./scripts/dos2unix.sh {} \;
find tests/typescrit -type f -exec ./scripts/dos2unix.sh {} \;
find tests/typescrit-errors -type f -exec ./scripts/dos2unix.sh {} \;

