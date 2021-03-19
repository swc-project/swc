// Helper for generating Babel fixture JSON.
// USAGE: node genbabel.js path/to/input.js > path/to/output.json
const {readFileSync} = require("fs");
const {parse} = require("@babel/parser");

const inputFile = process.argv[2];
if (!inputFile) {
    console.error("Missing input file. Hint: `node genbabel.js path/to/input.js`");
    process.exit(1);
}

const code = readFileSync(inputFile, "utf8");

const babelAst = parse(code);
console.log(JSON.stringify(babelAst, null, 2));

