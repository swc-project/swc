#/usr/bin/env bash
set -eux

npx swc src -d lib
ls -alR ./lib

fsync

sed -i '' 's/.mjs/.js/g' ./lib/*.js
