// Loaded from https://deno.land/x/case/pathCase.ts


import normalCase from "./normalCase.ts";

export default function (value: string, locale?: string): string {
  return normalCase(value, locale, "/");
}
