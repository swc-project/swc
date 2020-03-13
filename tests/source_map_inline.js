const validate = require('sourcemap-validator');
const fs = require('fs');

const jsFile = process.argv[1];

const jsContent = fs.readFileSync(jsFile, 'utf-8');

validate(jsContent);