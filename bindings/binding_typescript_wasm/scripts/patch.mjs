import fs from 'node:fs/promises';


const rawWasmFile = await fs.readFile('pkg/wasm_bg.wasm');
const origJsFile = await fs.readFile('pkg/wasm.js', 'utf8');

const base64 = rawWasmFile.toString('base64');

const patchedJsFile = origJsFile
    .replace(`const path = require('path').join(__dirname, 'wasm_bg.wasm');`, '')
    .replace(', fatal: true', '')
    .replace(`const bytes = require('fs').readFileSync(path);`, `
const { Buffer } = require('node:buffer');
const bytes = Buffer.from('${base64}', 'base64');`)

await fs.writeFile('pkg/wasm.js', patchedJsFile);

// Remove wasm file
await fs.unlink('pkg/wasm_bg.wasm');

// Remove wasm from .files section of package.json
const pkgJsonFile = await fs.readFile('pkg/package.json', 'utf8');
const pkgJson = JSON.parse(pkgJsonFile);
pkgJson.name = '@swc/wasm-typescript';
pkgJson.files = pkgJson.files.filter(file => file !== 'wasm_bg.wasm');
await fs.writeFile('pkg/package.json', JSON.stringify(pkgJson, null, 2));