// Loaded from https://deno.land/x/case@v2.1.0/paramCase.ts


import normalCase from "./normalCase.ts";

export default function paramCase(value: string, locale?: string): string {
  return normalCase(value, locale, "-");
}
