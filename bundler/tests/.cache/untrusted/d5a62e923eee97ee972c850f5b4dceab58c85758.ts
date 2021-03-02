// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/util/fs.js


import * as path from "../deps/path/mod.ts";

export const stat = Deno.stat;
export const readFile = Deno.readFile;
export const writeFile = Deno.writeFile;
export const readdir = Deno.readdir;


/**
 * Converts a file path to a Windows file path. The version of deno I was using
 * returned unix-style paths on Windows systems instead Windows style
 * @todo check if the current version of Deno corrects this issue
 *
 * @param {string} filePath is the file path that will be converted
 * @returns {string} the modified file path
 */
function crossPlatformPathConversion(filePath) {
	if (Deno.build.os === "win") {
		filePath = filePath.split("/").join("\\");
		filePath = filePath.substr(1, filePath.length - 1);
	}

	return filePath
}


/**
 * Modified mkdirp function using Deno APIs. The NPM mkdirp package creates
 * directories recursively and then returns the first new one created. This
 * function instead returns the absolute path of the directory created or
 * not created. When a directory already exists, mkdirp returns undefined. Given
 * knex is using this function mainly to check if a directory exists and then
 * create one if it doesn't, this function should work as a substitute for mkdirp,
 * despite not having the exact same API.
 *
 * @param {string} dir is the directory that will be created (recursivly)
 * @returns {Promise<string>} returns a Promise with the string of the directory created
 */
function mkdirp(dir) {
	const __dirname = crossPlatformPathConversion(new URL(".", import.meta.url).pathname);
	
	let newDir = path.join(__dirname, startDir);
	
	return Deno.mkdir(dir, {recursive: true}).then(() => newDir);
}

/**
 * Creates a temporary directory and returns it path.
 *
 * @returns {Promise<string>}
 */
function createTemp() {
  return Deno.makeTempDir();
}

/**
 * Ensures the given path exists.
 *  - If the path already exist, it's fine - it does nothing.
 *  - If the path doesn't exist, it will create it.
 *
 * @param {string} path
 * @returns {Promise}
 */
export function ensureDirectoryExists(dir) {
  return stat(dir).catch(() => mkdirp(dir));
}

export default {
  stat,
  readdir,
  readFile,
  writeFile,
  createTemp,
  ensureDirectoryExists,
};
