// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isIMEI.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
let imeiRegexWithoutHypens = /^[0-9]{15}$/;

/**
 * @ignore
 */
let imeiRegexWithHypens = /^\d{2}-\d{6}-\d{6}-\d{1}$/;

type IMEIOptions = {
  allowHyphens?: boolean;
};

export const isIMEI = (str: string, options?: IMEIOptions) => {
  assertString(str);
  options = options || {};

  // default regex for checking imei is the one without hyphens

  let imeiRegex = imeiRegexWithoutHypens;

  if (options.allowHyphens) {
    imeiRegex = imeiRegexWithHypens;
  }

  if (!imeiRegex.test(str)) {
    return false;
  }

  str = str.replace(/-/g, '');

  let sum = 0,
    mul = 2,
    l = 14;

  for (let i = 0; i < l; i++) {
    const digit = str.substring(l - i - 1, l - i);
    const tp = parseInt(digit, 10) * mul;
    if (tp >= 10) {
      sum += (tp % 10) + 1;
    } else {
      sum += tp;
    }
    if (mul === 1) {
      mul += 1;
    } else {
      mul -= 1;
    }
  }
  const chk = (10 - (sum % 10)) % 10;
  if (chk !== parseInt(str.substring(14, 15), 10)) {
    return false;
  }
  return true;
};
