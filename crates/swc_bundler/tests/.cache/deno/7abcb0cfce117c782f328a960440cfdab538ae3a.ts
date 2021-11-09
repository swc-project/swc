// Loaded from https://deno.land/x/case@v2.1.0/sentenceCase.ts


import normalCase from "./normalCase.ts";
import upperFirstCase from "./upperFirstCase.ts";

export default function sentenceCase(value: string, locale?: string): string {
  return upperFirstCase(normalCase(value, locale), locale);
}
