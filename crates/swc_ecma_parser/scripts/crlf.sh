#!/usr/bin/env bash

find tests -type f -exec ./scripts/dos2unix.sh {} \;

