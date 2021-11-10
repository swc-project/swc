#!/usr/bin/env bash

# 
# This scripts print the ideal output of lab.js
#

set -eux
terser --compress --format beautify -- lab.js
node lab.js