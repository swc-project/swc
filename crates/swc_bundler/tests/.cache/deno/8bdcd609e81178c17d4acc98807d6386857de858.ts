// Loaded from https://deno.land/x/case@v2.1.0/snakeCase.ts


import normalCase from "./normalCase.ts";

export default function snakeCase(value: string, locale?: string): string {
  return normalCase(value, locale, "_");
}
