import fs from "node:fs/promises";

const rawWasmPath = "pkg/wasm_bg.wasm";
const wasmJsPath = "pkg/wasm.js";
const packageJsonPath = "pkg/package.json";
const rawWasmFile = await fs.readFile(rawWasmPath);
const origJsFile = await fs.readFile(wasmJsPath, "utf8");

const base64 = rawWasmFile.toString("base64");
const patchedJsFile = origJsFile
    .replace(
        `const path = require('path').join(__dirname, 'wasm_bg.wasm');`,
        ""
    )
    .replace(", fatal: true", "")
    .replace(
        `const bytes = require('fs').readFileSync(path);`,
        `
const { Buffer } = require('node:buffer');
const bytes = Buffer.from('${base64}', 'base64');`
    );

await fs.writeFile(wasmJsPath, patchedJsFile);
await fs.unlink(rawWasmPath);

const pkgJsonFile = await fs.readFile(packageJsonPath, "utf8");
const pkgJson = JSON.parse(pkgJsonFile);
pkgJson.name = "@swc/nodejs-support-wasm";
pkgJson.description = "SWC WebAssembly helpers for Node.js";
pkgJson.files = pkgJson.files.filter((file) => file !== "wasm_bg.wasm");
await fs.writeFile(packageJsonPath, JSON.stringify(pkgJson, null, 2));
