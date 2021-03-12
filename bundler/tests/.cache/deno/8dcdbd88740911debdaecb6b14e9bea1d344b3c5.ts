// Loaded from https://deno.land/x/abc@v1.2.4/util.ts


import { extname } from "./vendor/https/deno.land/std/path/mod.ts";
import { MIME } from "./constants.ts";
import { NotFoundException } from "./http_exception.ts";

/** Returns the content-type based on the extension of a path. */
export function contentType(filepath: string): string | undefined {
  return MIME.DB[extname(filepath)];
}

export function hasTrailingSlash(str: string): boolean {
  if (str.length > 1 && str[str.length - 1] === "/") {
    return true;
  }

  return false;
}

export function NotFoundHandler(): never {
  throw new NotFoundException();
}
