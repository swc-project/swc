// Loaded from https://deno.land/x/case/paramCase.ts


import normalCase from "./normalCase.ts";

export default function paramCase(value: string, locale?: string): string {
  return normalCase(value, locale, "-");
}
