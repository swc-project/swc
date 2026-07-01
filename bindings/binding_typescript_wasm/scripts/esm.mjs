import fs from "node:fs/promises";

const pkgJsonFile = await fs.readFile("esm/package.json", "utf8");
const wasmJsFile = await fs.readFile("esm/wasm.js", "utf8");
const pkgJson = JSON.parse(pkgJsonFile);
pkgJson.name = '@swc/wasm-typescript-esm';
pkgJson.exports = {
    types: "./wasm.d.ts",
    node: "./wasm-node.js",
    default: "./wasm.js",
};

const patchedWasmJsFile = wasmJsFile
    .replace("export function __nodejsTransformModuleSyntax(", "function __nodejsTransformModuleSyntax(")
    .replace("export function __nodejsGetFirstExpression(", "function __nodejsGetFirstExpression(")
    .replace("export function __nodejsIsValidSyntax(", "function __nodejsIsValidSyntax(")
    .replace("export function __nodejsIsRecoverableError(", "function __nodejsIsRecoverableError(")
    + `

export const nodejs = Object.freeze({
    transformModuleSyntax: __nodejsTransformModuleSyntax,
    getFirstExpression: __nodejsGetFirstExpression,
    isValidSyntax: __nodejsIsValidSyntax,
    isRecoverableError: __nodejsIsRecoverableError,
});
`;

await Promise.all([
    fs.cp("src/wasm-node.js", "esm/wasm-node.js"),
    fs.writeFile("esm/wasm.js", patchedWasmJsFile),
    fs.writeFile("esm/package.json", JSON.stringify(pkgJson, null, 2)),
]);
