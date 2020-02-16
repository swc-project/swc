const validate = require('sourcemap-validator');
const fs = require('fs');

const jsFile = process.argv[2];
const mapFile = process.argv[3];

const jsContent = fs.readFileSync(jsFile, 'utf-8');
const mapContent = fs.readFileSync(mapFile, 'utf-8');

validate(jsContent, mapContent);