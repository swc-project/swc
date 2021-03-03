// Loaded from https://deno.land/x/case@v2.1.0/pathCase.ts


import normalCase from "./normalCase.ts";

export default function (value: string, locale?: string): string {
  return normalCase(value, locale, "/");
}
