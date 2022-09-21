import { minify } from "terser";

const code = process.argv[1];

const output = await minify(code, { sourceMap: true, });

console.log(JSON.stringify({
    code: output.code,
    map: output.map,
}))