#/usr/bin/env bash
set -eux

npx swc src -d lib
ls -alR ./lib
for f in "./lib/*.js"; do
  sed -i '' 's/.mjs/.js/g' $f;
done
