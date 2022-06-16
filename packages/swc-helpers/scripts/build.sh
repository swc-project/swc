#/usr/bin/env bash
set -eux

npx swc src -d lib
ls -alR ./lib

sed -i '' 's/.mjs/.js/g' ./lib/*.js
