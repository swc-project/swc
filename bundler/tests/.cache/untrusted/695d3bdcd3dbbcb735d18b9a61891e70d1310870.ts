// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/deps/path/mod.ts


// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/

import * as _win32 from "./win32.ts";
import * as _posix from "./posix.ts";

const isWindows = Deno.build.os == "windows";

const path = isWindows ? _win32 : _posix;

export const win32 = _win32;
export const posix = _posix;
export const {
  basename,
  delimiter,
  dirname,
  extname,
  format,
  fromFileUrl,
  isAbsolute,
  join,
  normalize,
  parse,
  relative,
  resolve,
  sep,
  toNamespacedPath,
} = path;

export * from "./common.ts";
export { SEP, SEP_PATTERN } from "./separator.ts";
export * from "./interface.ts";
export * from "./glob.ts";
