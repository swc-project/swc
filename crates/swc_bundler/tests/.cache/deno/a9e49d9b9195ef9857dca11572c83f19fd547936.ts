// Loaded from https://deno.land/x/oak/deps.ts


// Copyright 2018-2021 the oak authors. All rights reserved. MIT license.

// This file contains the external dependencies that oak depends upon

// `std` dependencies

export {
  copy as copyBytes,
  equals,
} from "https://deno.land/std@0.84.0/bytes/mod.ts";
export { Sha1 } from "https://deno.land/std@0.84.0/hash/sha1.ts";
export { HmacSha256 } from "https://deno.land/std@0.84.0/hash/sha256.ts";
export { serve, serveTLS } from "https://deno.land/std@0.84.0/http/server.ts";
export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.84.0/http/http_status.ts";
export { BufReader, BufWriter } from "https://deno.land/std@0.84.0/io/bufio.ts";
export {
  basename,
  extname,
  isAbsolute,
  join,
  normalize,
  parse,
  sep,
} from "https://deno.land/std@0.84.0/path/mod.ts";
export { assert } from "https://deno.land/std@0.84.0/testing/asserts.ts";
export {
  acceptable,
  acceptWebSocket,
} from "https://deno.land/std@0.84.0/ws/mod.ts";
export type { WebSocket } from "https://deno.land/std@0.84.0/ws/mod.ts";

// 3rd party dependencies

export {
  contentType,
  extension,
  lookup,
} from "https://deno.land/x/media_types@v2.7.1/mod.ts";
export {
  compile,
  parse as pathParse,
  pathToRegexp,
} from "https://deno.land/x/path_to_regexp@v6.2.0/index.ts";
export type {
  Key,
  ParseOptions,
  TokensToRegexpOptions,
} from "https://deno.land/x/path_to_regexp@v6.2.0/index.ts";
