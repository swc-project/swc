// Loaded from https://deno.land/x/case/headerCase.ts


import upperCase from "./upperCase.ts";
import normalCase from "./normalCase.ts";

export default function headerCase(value: string, locale?: string): string {
  return normalCase(value, locale, "-").replace(/^.|-./g, function (
    m: string,
  ): string {
    return upperCase(m, locale);
  });
}
