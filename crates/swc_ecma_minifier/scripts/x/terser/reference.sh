#!/usr/bin/env bash
set -eux

##### ##### ##### ##### #####
# Usage: ./scripts/terser/reference.sh path/to/directory
#
# Used to generate expected output using terser.
##### ##### ##### ##### #####

find $1 -name input.js \
    | xargs -L 1 -I {} terser --compress --output {}.output.js -- {}

find . -name 'input.js.output.js' -print0 | xargs -0 -n1 bash -c 'mv "$0" "${0/input.js.output.js/output.js}"'

# Make it easier to compare
prettier --write $1
yarn run eslint --fix $1