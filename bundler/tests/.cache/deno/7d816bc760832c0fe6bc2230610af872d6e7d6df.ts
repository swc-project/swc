// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isISSN.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const issn = '^\\d{4}-?\\d{3}[\\dX]$';

type ISSNOptions = {
  requireHyphen?: boolean;
  caseSensitive?: boolean;
};

export const isISSN = (str: string, options: ISSNOptions = {}) => {
  assertString(str);
  let testIssn = issn;

  testIssn = options.requireHyphen ? testIssn.replace('?', '') : testIssn;
  const testIssnRegex = options.caseSensitive
    ? new RegExp(testIssn)
    : new RegExp(testIssn, 'i');

  if (!testIssnRegex.test(str)) {
    return false;
  }

  const digits = str.replace('-', '').toUpperCase();
  let checksum = 0;
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    checksum += (digit === 'X' ? 10 : +digit) * (8 - i);
  }
  return checksum % 11 === 0;
};
