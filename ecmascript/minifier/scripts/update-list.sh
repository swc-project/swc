#!/usr/bin/env bash
#
# This script updates golden.txt and ignored.txt
# 
#
# Note that even if a test is ignored, this script will invoke it.
#
set -eu


# Clean the ignore list
echo '' > tests/ignored.txt

scripts/add-golden.sh
scripts/ignore.sh 'fixture_tests__terser__compress__'