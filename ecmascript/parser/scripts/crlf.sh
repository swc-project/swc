#!/usr/bin/env bash

find tests/typescript -type f -exec ./scripts/dos2unix.sh {} \;

