// Helper for generating Babel fixture JSON.
// USAGE: node babelgen.js path/to/input.js > path/to/output.json
const {readFileSync} = require("fs");
const {parse} = require("@babel/parser");

const inputFile = process.argv[2];
if (!inputFile) {
    console.error("Missing input file. Hint: `node babelgen.js path/to/input.js`");
    process.exit(1);
}

const code = readFileSync(inputFile, "utf8");

const plugins = ["classProperties", "classStaticBlocks"];
if (inputFile && inputFile.endsWith(".jsx")) {
    plugins.push("jsx");
}
if (inputFile && inputFile.endsWith(".ts")) {
    plugins.push("typescript");
}

const babelAst = parse(code, {
    plugins,
    sourceType: inputFile.endsWith(".mjs") ? "module" : undefined,
    // allowImportExportEverywhere: true,
});
console.log(JSON.stringify(babelAst, null, 4));

