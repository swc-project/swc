// Loaded from https://deno.land/x/oak/send.ts


/*!
 * Adapted from koa-send at https://github.com/koajs/send and which is licensed
 * with the MIT license.
 */

import type { Context } from "./context.ts";
import { createHttpError } from "./httpError.ts";
import { basename, extname, parse, sep } from "./deps.ts";
import { decodeComponent, resolvePath } from "./util.ts";

export interface SendOptions {
  /** Try to serve the brotli version of a file automatically when brotli is
   * supported by a client and if the requested file with `.br` extension
   * exists. (defaults to `true`) */
  brotli?: boolean;

  /** Try to match extensions from passed array to search for file when no
   * extension is sufficed in URL. First found is served. (defaults to
   * `undefined`) */
  extensions?: string[];

  /** If `true`, format the path to serve static file servers and not require a
   * trailing slash for directories, so that you can do both `/directory` and
   * `/directory/`. (defaults to `true`) */
  format?: boolean;

  /** Try to serve the gzipped version of a file automatically when gzip is
   * supported by a client and if the requested file with `.gz` extension
   * exists. (defaults to `true`). */
  gzip?: boolean;

  /** Allow transfer of hidden files. (defaults to `false`) */
  hidden?: boolean;

  /** Tell the browser the resource is immutable and can be cached
   * indefinitely. (defaults to `false`) */
  immutable?: boolean;

  /** Name of the index file to serve automatically when visiting the root
   * location. (defaults to none) */
  index?: string;

  /** Browser cache max-age in milliseconds. (defaults to `0`) */
  maxage?: number;

  /** Root directory to restrict file access. */
  root: string;
}

function isHidden(path: string) {
  const pathArr = path.split("/");
  for (const segment of pathArr) {
    if (segment[0] === "." && segment !== "." && segment !== "..") {
      return true;
    }
    return false;
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    return (await Deno.stat(path)).isFile;
  } catch {
    return false;
  }
}

/** Asynchronously fulfill a response with a file from the local file
 * system.
 *
 * Requires Deno read permission for the `root` directory. */
export async function send(
  // deno-lint-ignore no-explicit-any
  { request, response }: Context<any>,
  path: string,
  options: SendOptions = { root: "" },
): Promise<string | undefined> {
  const {
    brotli = true,
    extensions,
    format = true,
    gzip = true,
    hidden = false,
    immutable = false,
    index,
    maxage = 0,
    root,
  } = options;
  const trailingSlash = path[path.length - 1] === "/";
  path = decodeComponent(path.substr(parse(path).root.length));
  if (index && trailingSlash) {
    path += index;
  }

  if (!hidden && isHidden(path)) {
    throw createHttpError(403);
  }

  path = resolvePath(root, path);

  let encodingExt = "";
  if (
    brotli &&
    request.acceptsEncodings("br", "identity") === "br" &&
    (await exists(`${path}.br`))
  ) {
    path = `${path}.br`;
    response.headers.set("Content-Encoding", "br");
    response.headers.delete("Content-Length");
    encodingExt = ".br";
  } else if (
    gzip &&
    request.acceptsEncodings("gzip", "identity") === "gzip" &&
    (await exists(`${path}.gz`))
  ) {
    path = `${path}.gz`;
    response.headers.set("Content-Encoding", "gzip");
    response.headers.delete("Content-Length");
    encodingExt = ".gz";
  }

  if (extensions && !/\.[^/]*$/.exec(path)) {
    for (let ext of extensions) {
      if (!/^\./.exec(ext)) {
        ext = `.${ext}`;
      }
      if (await exists(`${path}${ext}`)) {
        path += ext;
        break;
      }
    }
  }

  let stats: Deno.FileInfo;
  try {
    stats = await Deno.stat(path);

    if (stats.isDirectory) {
      if (format && index) {
        path += `/${index}`;
        stats = await Deno.stat(path);
      } else {
        return;
      }
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      throw createHttpError(404, err.message);
    }
    throw createHttpError(500, err.message);
  }

  let mtime: number | null = null;
  if (response.headers.has("Last-Modified")) {
    mtime = new Date(response.headers.get("Last-Modified")!).getTime();
  } else if (stats.mtime) {
    // Round down to second because it's the precision of the UTC string.
    mtime = stats.mtime.getTime();
    mtime -= mtime % 1000;
    response.headers.set("Last-Modified", new Date(mtime).toUTCString());
  }

  if (!response.headers.has("Cache-Control")) {
    const directives = [`max-age=${(maxage / 1000) | 0}`];
    if (immutable) {
      directives.push("immutable");
    }
    response.headers.set("Cache-Control", directives.join(","));
  }
  if (!response.type) {
    response.type = encodingExt !== ""
      ? extname(basename(path, encodingExt))
      : extname(path);
  }

  if (request.headers.has("If-Modified-Since") && mtime) {
    const ifModifiedSince = new Date(request.headers.get("If-Modified-Since")!);
    if (ifModifiedSince.getTime() >= mtime) {
      response.status = 304;
      return path;
    }
  }

  response.headers.set("Content-Length", String(stats.size));

  const file = await Deno.open(path, { read: true });
  response.addResource(file.rid);
  response.body = file;

  return path;
}
