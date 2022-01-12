#!/usr/bin/env bash
set -eu

dir="${1-"./inputs/"}"

echo "Removing useless files in $dir"
find $dir -type f \( \
    -name "*.map" -o \
    -name "*.html" -o \
    -name "*.xml" -o \
    -name "*.aac" -o \
    -name "*.avif" -o \
    -name "*.ogg" -o \
    -name "*.mp3" -o \
    -name "*.mp4" -o \
    -name "*.wav" -o \
    -name "*.bat" -o \
    -name "*.cur" -o \
    -name "*.db" -o \
    -name "*.diff" -o \
    -name "*.donotoptimizepng" -o \
    -name "*.gif" -o \
    -name "*.svg" -o \
    -name "*.css" -o \
    -name "*.png" -o \
    -name "*.json" -o \
    -name "*.woff" -o \
    -name "*.woff2" -o \
    -name "*.otf" -o \
    -name "*.ttf" -o \
    -name "*.eot" -o \
    -name "*.flow" -o \
    -name "*.md" -o \
    -name "*.less" -o \
    -name "*.sass" -o \
    -name "*.scss" -o \
    -name "*.ico" -o \
    -name "*.sh" -o \
    -name "*.jpg" -o \
    -name "*.webp" -o \
    -name "*.jpeg" -o \
    -name "*.gz" -o \
    -name "*.gzip" -o \
    -name "*.zip" -o \
    -name "*.woff" -o \
    -name "*.wasm" -o \
    -name "*.wast" -o \
    -name "*.tsbuildinfo" \
    \) \
    -delete


echo "Removing empty directories in $dir"

find $dir -type d -empty -delete

echo "Reducing js files in $dir"