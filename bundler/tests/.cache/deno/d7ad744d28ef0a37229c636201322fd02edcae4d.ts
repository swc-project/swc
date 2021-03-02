// Loaded from https://deno.land/x/case/lowerCase.ts


/**
 * via: https://github.com/blakeembrey/lower-case
 */

import { LanguageSpecific } from "./types.ts";

/**
 * Special language-specific overrides.
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
const LANGUAGES: LanguageSpecific = {
  tr: {
    regexp: /\u0130|\u0049|\u0049\u0307/g,
    map: {
      İ: "\u0069",
      I: "\u0131",
      İ: "\u0069",
    },
  },
  az: {
    regexp: /[\u0130]/g,
    map: {
      İ: "\u0069",
      I: "\u0131",
      İ: "\u0069",
    },
  },
  lt: {
    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
    map: {
      I: "\u0069\u0307",
      J: "\u006A\u0307",
      Į: "\u012F\u0307",
      Ì: "\u0069\u0307\u0300",
      Í: "\u0069\u0307\u0301",
      Ĩ: "\u0069\u0307\u0303",
    },
  },
};

/**
 * Lowercase a string.
 *
 * @param  {String} str
 * @return {String}
 */
export default function (str: string, locale?: string): string {
  str = str == null ? "" : String(str);

  if (!locale) {
    return str.toLowerCase();
  }

  const lang = LANGUAGES[locale];

  if (lang) {
    str = str.replace(lang.regexp, (m: string): string => lang.map[m]);
  }

  return str.toLowerCase();
}
