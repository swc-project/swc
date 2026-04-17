#!/usr/bin/env node
'use strict';

const fs = require('node:fs');

const input = fs.readFileSync(0, 'utf8');
const lines = input.match(/[^\n]*\n|[^\n]+/g) ?? [];

lines.sort();
process.stdout.write(lines.join(''));
