#!/usr/bin/env bash
set -eu

run() {
    terser --compress -- ./tests/projects/files/$1 > ./tests/projects/refs/$1
}


mkdir -p ./tests/projects/refs

run angular-1.2.5.js
run backbone-1.1.0.js
run jquery-1.9.1.js
run jquery.mobile-1.4.2.js
run mootools-1.4.5.js
run underscore-1.5.2.js
run yui-3.12.0.js
run react-17.0.2.js
run react-dom-17.0.2.js

prettier --write tests/projects/refs/
yarn run eslint --fix ./tests/projects/refs/