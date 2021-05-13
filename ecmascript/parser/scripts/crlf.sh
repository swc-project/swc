#!/usr/bin/env bash

find tests/typescript -type f | parallel ./scripts/dos2unix.sh

