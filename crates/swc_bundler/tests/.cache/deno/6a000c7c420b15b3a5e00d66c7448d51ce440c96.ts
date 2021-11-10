// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isISBN.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/;

/**
 * @ignore
 */
const isbn13Maybe = /^(?:[0-9]{13})$/;

/**
 * @ignore
 */
const factor = [1, 3];

export const isISBN = (str: string, version?: number): boolean => {
  assertString(str);
  const _version = version ? String(version) : '';
  if (!_version) {
    return isISBN(str, 10) || isISBN(str, 13);
  }
  const sanitized = str.replace(/[\s-]+/g, '');
  let checksum = 0;
  let i;
  if (_version === '10') {
    if (!isbn10Maybe.test(sanitized)) {
      return false;
    }
    for (i = 0; i < 9; i++) {
      checksum += (i + 1) * +sanitized.charAt(i);
    }
    if (sanitized.charAt(9) === 'X') {
      checksum += 10 * 10;
    } else {
      checksum += 10 * +sanitized.charAt(9);
    }
    if (checksum % 11 === 0) {
      return !!sanitized;
    }
  } else if (_version === '13') {
    if (!isbn13Maybe.test(sanitized)) {
      return false;
    }
    for (i = 0; i < 12; i++) {
      checksum += factor[i % 2] * +sanitized.charAt(i);
    }
    if (+sanitized.charAt(12) - ((10 - (checksum % 10)) % 10) === 0) {
      return !!sanitized;
    }
  }
  return false;
};
