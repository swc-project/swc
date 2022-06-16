#/bin/bash

npx swc src -d lib
for f in lib/*.js; do
  sed -i '' 's/.mjs/.js/g' $f;
done
