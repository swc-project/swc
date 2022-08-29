import { parse } from "@babel/parser";
import generate from "@babel/generator";

const code = process.argv[2];
const ast = parse(code);

const output = generate.default(
    ast,
    {
        sourceMaps: true,
        minified: true,
    },
    code
);

console.log(JSON.stringify({
    code: output.code,
    map: JSON.stringify(output.map),
}))