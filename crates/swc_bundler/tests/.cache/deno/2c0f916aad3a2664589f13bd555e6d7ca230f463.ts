// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isAscii.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const ascii = /^[\x00-\x7F]+$/;

export const isAscii = (str: string) => {
  assertString(str);
  return ascii.test(str);
};
