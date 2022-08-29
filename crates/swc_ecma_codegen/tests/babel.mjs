import { parse } from "@babel/parser";
import generate from "@babel/generator";

const code = "class Example {}";
const ast = parse(code);

const output = generate(
    ast,
    {
        sourceMaps: true,
        minified: true
    },
    code
);

console.log(JSON.stringify({
    code: output.code,
    map: output.map,
}))