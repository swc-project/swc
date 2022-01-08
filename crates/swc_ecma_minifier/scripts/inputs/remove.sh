#!/usr/bin/env bash
set -eu


find ./inputs/ -type f \
    -name "*.html" \
    -name "*.xml" \
    -name "*.aac" \
    -name "*.avif" \
    -name "*.ogg" \
    -name "*.mp3" \
    -name "*.mp4" \
    -name "*.wav" \
    -name "*.bat" \
    -name "*.cur" \
    -name "*.db" \
    -name "*.diff" \
    -name "*.donotoptimizepng" \
    -name "*.gif" \
    -name "*.svg" \
    -name "*.css" \
    -name "*.png" \
    -name "*.json" \
    -name "*.woff" \
    -name "*.woff2" \
    -name "*.otf" \
    -name "*.ttf" \
    -name "*.eot" \
    -name "*.flow" \
    -name "*.md" \
    -name "*.less" \
    -name "*.sass" \
    -name "*.scss" \
    -name "*.ico" \
    -name "*.sh" \
    -name "*.jpg" \
    -name "*.webp" \
    -name "*.jpeg" \
    -name "*.gz" \
    -name "*.gzip" \
    -name "*.zip" \
    -name "*.woff" \
    -name "*.wasm" \
    -name "*.wast" \
    -name "*.tsbuildinfo" \
    -print0 -delete

# hpb
# jsonp
# lang
# php
# properties
# smd
# styl
# svg alias
# swf
# ts
# txt
# vtt
# vue
# xap

find ./inputs -type d -empty -delete