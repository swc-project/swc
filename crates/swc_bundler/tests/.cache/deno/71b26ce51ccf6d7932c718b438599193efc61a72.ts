// Loaded from https://deno.land/x/case/dotCase.ts


import normalCase from "./normalCase.ts";

export default function dotCase(value: string, locale?: string): string {
  return normalCase(value, locale, ".");
}
