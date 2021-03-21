// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isOctal.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const octal = /^(0o)?[0-7]+$/i;

export const isOctal = (str: string) => {
  assertString(str);
  return octal.test(str);
};
