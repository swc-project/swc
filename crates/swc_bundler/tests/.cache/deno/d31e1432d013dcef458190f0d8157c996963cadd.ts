// Loaded from https://deno.land/x/case/pascalCase.ts


import camelCase from "./camelCase.ts";
import upperFirstCase from "./upperFirstCase.ts";

export default function pascalCase(
  value: string,
  locale?: string,
  mergeNumbers?: boolean,
): string {
  return upperFirstCase(camelCase(value, locale, mergeNumbers), locale);
}
