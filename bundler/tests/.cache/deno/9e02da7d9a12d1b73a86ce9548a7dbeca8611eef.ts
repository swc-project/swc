// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isISIN.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;

export const isISIN = (str: string) => {
  assertString(str);
  if (!isin.test(str)) {
    return false;
  }

  const checksumStr = str.replace(/[A-Z]/g, (character) =>
    // @ts-ignore allowing typedoc to build
    parseInt(character, 36)
  );

  let sum = 0;
  let digit;
  let tmpNum;
  let shouldDouble = true;
  for (let i = checksumStr.length - 2; i >= 0; i--) {
    digit = checksumStr.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += tmpNum + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }

  return parseInt(str.substr(str.length - 1), 10) === (10000 - sum) % 10;
};
