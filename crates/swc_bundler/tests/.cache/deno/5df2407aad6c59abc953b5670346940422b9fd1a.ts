// Loaded from https://deno.land/x/case@v2.1.0/swapCase.ts


import upperCase from "./upperCase.ts";
import lowerCase from "./lowerCase.ts";

export default function (str: string, locale?: string): string {
  if (str == null) {
    return "";
  }

  let result: string = "";

  for (let i: number = 0; i < str.length; i++) {
    const c: string = str[i];
    const u: string = upperCase(c, locale);

    result += u === c ? lowerCase(c, locale) : u;
  }

  return result;
}
