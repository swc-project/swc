import fs from "node:fs/promises";
import path from "node:path";

const [
    outDir = "pkg",
    packageName = "@swc/wasm-typescript",
    packageDescription,
] = process.argv.slice(2);

const rawWasmPath = path.join(outDir, "wasm_bg.wasm");
const wasmJsPath = path.join(outDir, "wasm.js");
const packageJsonPath = path.join(outDir, "package.json");
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

// Remove wasm file
await fs.unlink(rawWasmPath);

// Remove wasm from .files section of package.json
const pkgJsonFile = await fs.readFile(packageJsonPath, "utf8");
const pkgJson = JSON.parse(pkgJsonFile);
pkgJson.name = packageName;
if (packageDescription) {
    pkgJson.description = packageDescription;
}
pkgJson.files = pkgJson.files.filter((file) => file !== "wasm_bg.wasm");
await fs.writeFile(packageJsonPath, JSON.stringify(pkgJson, null, 2));
