// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isPostalCode.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

// common patterns
/**
 * @ignore
 */
const threeDigit = /^\d{3}$/;

/**
 * @ignore
 */
const fourDigit = /^\d{4}$/;

/**
 * @ignore
 */
const fiveDigit = /^\d{5}$/;

/**
 * @ignore
 */
const sixDigit = /^\d{6}$/;

type PostalCode =
  | 'AD'
  | 'AT'
  | 'AU'
  | 'BE'
  | 'BG'
  | 'BR'
  | 'CA'
  | 'CH'
  | 'CZ'
  | 'DE'
  | 'DK'
  | 'DZ'
  | 'EE'
  | 'ES'
  | 'FI'
  | 'FR'
  | 'GB'
  | 'GR'
  | 'HR'
  | 'HU'
  | 'ID'
  | 'IE'
  | 'IL'
  | 'IN'
  | 'IS'
  | 'IT'
  | 'JP'
  | 'KE'
  | 'LI'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'MX'
  | 'MT'
  | 'NL'
  | 'NO'
  | 'NP'
  | 'NZ'
  | 'PL'
  | 'PR'
  | 'PT'
  | 'RO'
  | 'RU'
  | 'SA'
  | 'SE'
  | 'SI'
  | 'SK'
  | 'TN'
  | 'TW'
  | 'UA'
  | 'US'
  | 'ZA'
  | 'ZM'
  | 'any';

/**
 * @ignore
 */
const patterns = {
  AD: /^AD\d{3}$/,
  AT: fourDigit,
  AU: fourDigit,
  BE: fourDigit,
  BG: fourDigit,
  BR: /^\d{5}-\d{3}$/,
  CA: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][\s\-]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
  CH: fourDigit,
  CZ: /^\d{3}\s?\d{2}$/,
  DE: fiveDigit,
  DK: fourDigit,
  DZ: fiveDigit,
  EE: fiveDigit,
  ES: /^(5[0-2]{1}|[0-4]{1}\d{1})\d{3}$/,
  FI: fiveDigit,
  FR: /^\d{2}\s?\d{3}$/,
  GB: /^(gir\s?0aa|[a-z]{1,2}\d[\da-z]?\s?(\d[a-z]{2})?)$/i,
  GR: /^\d{3}\s?\d{2}$/,
  HR: /^([1-5]\d{4}$)/,
  HU: fourDigit,
  ID: fiveDigit,
  IE: /^(?!.*(?:o))[A-z]\d[\dw]\s\w{4}$/i,
  IL: /^(\d{5}|\d{7})$/,
  IN: /^((?!10|29|35|54|55|65|66|86|87|88|89)[1-9][0-9]{5})$/,
  IS: threeDigit,
  IT: fiveDigit,
  JP: /^\d{3}\-\d{4}$/,
  KE: fiveDigit,
  LI: /^(948[5-9]|949[0-7])$/,
  LT: /^LT\-\d{5}$/,
  LU: fourDigit,
  LV: /^LV\-\d{4}$/,
  MX: fiveDigit,
  MT: /^[A-Za-z]{3}\s{0,1}\d{4}$/,
  NL: /^\d{4}\s?[a-z]{2}$/i,
  NO: fourDigit,
  NP: /^(10|21|22|32|33|34|44|45|56|57)\d{3}$|^(977)$/i,
  NZ: fourDigit,
  PL: /^\d{2}\-\d{3}$/,
  PR: /^00[679]\d{2}([ -]\d{4})?$/,
  PT: /^\d{4}\-\d{3}?$/,
  RO: sixDigit,
  RU: sixDigit,
  SA: fiveDigit,
  SE: /^[1-9]\d{2}\s?\d{2}$/,
  SI: fourDigit,
  SK: /^\d{3}\s?\d{2}$/,
  TN: fourDigit,
  TW: /^\d{3}(\d{2})?$/,
  UA: fiveDigit,
  US: /^\d{5}(-\d{4})?$/,
  ZA: fourDigit,
  ZM: fiveDigit,
};

export const isPostalCode = (str: string, locale: PostalCode) => {
  assertString(str);
  if (locale in patterns) {
    return (patterns as any)[locale].test(str);
  } else if (locale === 'any') {
    for (const key in patterns) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if (patterns.hasOwnProperty(key)) {
        const pattern = (patterns as any)[key];
        if (pattern.test(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error(`Invalid locale '${locale}'`);
};
