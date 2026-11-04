import path from 'path';
import fs from 'fs-extra';
import {basePath} from './base-path.ts'

export async function loadNode(file: string) {
  const pathToFile = path.resolve(basePath, `${file}.ts`);
  if (await fs.pathExists(pathToFile)) {
    const { default: _default, ...rest } = await import(pathToFile);
    return rest;
  }
  return {};
}
