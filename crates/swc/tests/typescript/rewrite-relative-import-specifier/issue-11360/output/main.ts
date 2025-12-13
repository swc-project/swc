import { _ as _ts_rewrite_relative_import_extension } from "@swc/helpers/_/_ts_rewrite_relative_import_extension";
import path from 'path';
import fs from 'fs-extra';
import { basePath } from "./base-path.js";
export async function loadNode(file) {
    const pathToFile = path.resolve(basePath, `${file}.ts`);
    if (await fs.pathExists(pathToFile)) {
        const { default: _default, ...rest } = await import(_ts_rewrite_relative_import_extension(pathToFile));
        return rest;
    }
    return {};
}
