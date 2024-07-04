import fs from 'node:fs/promises';


const rawWasmFile = await fs.readFile('pkg/wasm_bg.wasm');
const origJsFile = await fs.readFile('pkg/wasm.js', 'utf8');

const base64=rawWasmFile.toString('base64');

const patchedJsFile = origJsFile
    .replace(`const path = require('path').join(__dirname, 'wasm_bg.wasm');`, '')
    .replace(`const bytes = require('fs').readFileSync(path);`, `
const { Buffer } = require('node:buffer');
const bytes = Buffer.from('${base64}', 'base64');`)

await fs.writeFile('pkg/wasm.js', patchedJsFile);