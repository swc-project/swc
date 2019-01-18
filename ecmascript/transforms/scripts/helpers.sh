#!/usr/bin/bash

rm -f *.js

cp ../../node_modules/@babel/runtime/helpers/*.js .

# camelCase to snake case
rename -f 's/([a-z])([A-Z])/$1_$2/g; y/A-Z/a-z/' *.js
rename --prepend=_ *.js
