// Loaded from https://deno.land/x/case@v2.1.0/dotCase.ts


import normalCase from "./normalCase.ts";

export default function dotCase(value: string, locale?: string): string {
  return normalCase(value, locale, ".");
}
