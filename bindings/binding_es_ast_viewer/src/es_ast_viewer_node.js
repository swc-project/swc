import fs from "node:fs/promises";
import initAsync from "./es_ast_viewer.js";

const wasm = new URL("./es_ast_viewer_bg.wasm", import.meta.url);

export default function (init = { module_or_path: fs.readFile(wasm) }) {
    return initAsync(init);
}

export * from "./es_ast_viewer.js";