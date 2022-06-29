#!/usr/bin/env bash
set -eu

grep 'DYNAMIC:' all.log | sed 's/DYNAMIC://' | sort | uniq