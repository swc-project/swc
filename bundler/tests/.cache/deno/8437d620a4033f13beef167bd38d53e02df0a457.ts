// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isBIC.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const isBICReg = /^[A-z]{4}[A-z]{2}\w{2}(\w{3})?$/;

export const isBIC = (str: string) => {
  assertString(str);
  return isBICReg.test(str);
};
