import fs from "node:fs/promises";
import initAsync from "./wasm.js";

const wasm = new URL("./wasm_bg.wasm", import.meta.url);

export default function (init = fs.readFile(wasm)) {
    return initAsync(init);
}

export * from "./wasm.js";
