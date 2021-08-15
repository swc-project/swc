// Loaded from https://deno.land/x/compress@v0.3.8/tgz/mod.ts


import * as tar from "../tar/mod.ts";
import { gunzipFile, gzipFile } from "../gzip/gzip_file.ts";
import type { compressInterface } from "../interface.ts";
import { path } from "../deps.ts";

export async function uncompress(src: string, dest: string): Promise<void> {
  const filename = path.basename(src);
  const extname = path.extname(filename);
  const tarFilename = extname === ".tgz"
    ? filename.slice(0, -3) + "tar"
    : (extname === ".gz" ? filename.slice(0, -3) : filename);
  const tmpDir = await Deno.makeTempDir();
  const tmpPath = path.join(tmpDir, tarFilename);
  await gunzipFile(src, tmpPath);
  await tar.uncompress(tmpPath, dest);
  await Deno.remove(tmpDir, { recursive: true });
}

export async function compress(
  src: string,
  dest: string,
  options?: compressInterface,
): Promise<void> {
  const filename = path.basename(src);
  const tmpDir = await Deno.makeTempDir();
  const tmpPath = path.join(tmpDir, filename);
  await tar.compress(src, tmpPath, options);
  await gzipFile(tmpPath, dest);
  await Deno.remove(tmpDir, { recursive: true });
}
