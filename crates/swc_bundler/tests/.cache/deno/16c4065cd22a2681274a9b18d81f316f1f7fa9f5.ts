// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isBase32.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const base32 = /^[A-Z2-7]+=*$/;

export const isBase32 = (str: string) => {
  assertString(str);

  const len = str.length;
  if (len > 0 && len % 8 === 0 && base32.test(str)) {
    return true;
  }
  return false;
};
