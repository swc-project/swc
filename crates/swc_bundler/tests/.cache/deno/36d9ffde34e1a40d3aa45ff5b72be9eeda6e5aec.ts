// Loaded from https://deno.land/x/case@v2.1.0/upperFirstCase.ts


import upperCase from "./upperCase.ts";

export default function (str: string, locale?: string): string {
  if (str == null) {
    return "";
  }

  str = String(str);

  return upperCase(str.charAt(0), locale) + str.substr(1);
}
