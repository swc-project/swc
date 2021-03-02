// Loaded from https://deno.land/x/case/camelCase.ts


import upperCase from "./upperCase.ts";
import normalCase from "./normalCase.ts";

export default function camelCase(
  value: string,
  locale?: string,
  mergeNumbers?: boolean,
): string {
  let result = normalCase(value, locale);

  // Replace periods between numeric entities with an underscore.
  if (!mergeNumbers) {
    result = result.replace(/ (?=\d)/g, "_");
  }

  // Replace spaces between words with an upper cased character.
  return result.replace(/ (.)/g, function (m: string, $1: string): string {
    return upperCase($1, locale);
  });
}
