import { parse } from "@babel/parser";
import generate from "@babel/generator";

const code = process.argv[1];
const ast = parse(code, {
    sourceFilename: 'input.js',
    sourceType: process.argv[2],
});

const output = generate.default(
    ast,
    {
        sourceMaps: true,
        minified: true,
        comments: false,
        sourceFileName: 'input.js',
    },
    code
);

console.log(JSON.stringify({
    code: output.code,
    map: JSON.stringify(output.map),
}))