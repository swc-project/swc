#!/usr/bin/env node

const { readFileSync } = require('fs');
const { parseModule } = require('esprima');
const { notDeepEqual } = require('assert');

let [ast1, ast2] =
    process.argv.slice(2) // skip node executable and script filename
        .map(file => readFileSync(file, 'utf-8')) // read given files as strings
        .map(code => {
            // console.log(code);
            return parseModule(code)
        }); // parse into ASTs

notDeepEqual(ast1, ast2); // ensure they're still not equal