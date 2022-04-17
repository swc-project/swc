#!/usr/bin/env bash
#
# Usage:
# 
#   From your clone of next.js, you can invoke this script like
#
#       /absolute/path/to/this/script.sh examples/foo
#
# This script will
#
#  - build native binary (`next-swc`)
#  - install dependnecies using `yarn``
#  - remove some dependencies (`next`, `react`, `react-dom`)
#  - yarn next build examples/foo
#  - yarn next start examples/foo
