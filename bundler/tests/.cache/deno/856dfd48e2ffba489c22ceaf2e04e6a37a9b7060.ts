// Loaded from https://deno.land/x/compress@v0.3.8/mod.ts


export * as tar from "./tar/mod.ts";
export * as tgz from "./tgz/mod.ts";
export {
  gzipFile,
  gunzipFile,
  GzipStream,
  /** slow */
  // gzip,
  // gunzip,
} from "./gzip/mod.ts";
/** slow */
// export { deflateRaw, inflateRaw } from "./deflate/mod.ts";
/** fast */
export {
  deflate,
  inflate,
  deflateRaw,
  inflateRaw,
  gzip,
  gunzip,
} from "./zlib/mod.ts";
