#!/usr/bin/env bash
#
# This script updates golden.txt and TODO.txt
# 
#
# Note that even if a test is ignored, this script will invoke it.
#
set -eu


# Clean the ignore list
echo '' > tests/TODO.txt

scripts/add-golden.sh
scripts/ignore.sh 'fixture_tests__terser__compress__'