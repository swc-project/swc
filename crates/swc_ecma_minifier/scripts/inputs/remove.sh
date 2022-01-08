#!/usr/bin/env bash
set -eu


find ./inputs/ -type f -name "*.gif" -name "*.svg" -name "*.css" -name "*.png" -name "*.json" -print0 -delete

find ./inputs -type d -empty -delete