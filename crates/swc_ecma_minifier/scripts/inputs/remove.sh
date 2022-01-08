#!/usr/bin/env bash
set -eu


find ./inputs/ -type f -name "*.gif" -name "*.svg" -name "*.css" -name "*.png" -name "*.json" -name "*.woff" -name "*.woff2" -name "*.ttf" -name "*.eot" -name "*.jpg" -name "*.jpeg" -print0 -delete

find ./inputs -type d -empty -delete