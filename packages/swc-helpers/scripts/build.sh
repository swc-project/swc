#/usr/bin/env bash
set -eu

npx swc src -d lib
ls -alR .
for f in lib/*.js; do
  sed -i '' 's/.mjs/.js/g' $f;
done
