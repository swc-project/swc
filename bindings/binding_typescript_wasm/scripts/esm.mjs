import fs from "node:fs/promises";

const pkgJsonFile = await fs.readFile("esm/package.json", "utf8");
const pkgJson = JSON.parse(pkgJsonFile);
pkgJson.name = '@swc/wasm-typescript-esm';
pkgJson.exports = {
    types: "./wasm.d.ts",
    node: "./wasm-node.js",
    default: "./wasm.js",
};

await Promise.all([
    fs.cp("src/wasm-node.js", "esm/wasm-node.js"),
    fs.writeFile("esm/package.json", JSON.stringify(pkgJson, null, 2)),
]);
