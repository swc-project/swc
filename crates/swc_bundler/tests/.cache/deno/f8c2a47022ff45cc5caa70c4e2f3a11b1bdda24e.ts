// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isISRC.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

// see http://isrc.ifpi.org/en/isrc-standard/code-syntax
/**
 * @ignore
 */
const isrc = /^[A-Z]{2}[0-9A-Z]{3}\d{2}\d{5}$/;

export const isISRC = (str: string) => {
  assertString(str);
  return isrc.test(str);
};
