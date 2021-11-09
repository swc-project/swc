// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isAlphanumeric.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';
// @ts-ignore allowing typedoc to build
import { alphanumeric } from '../helpers/alpha.ts';

export const isAlphanumeric = (str: string, locale = 'en-US') => {
  assertString(str);
  if (locale in alphanumeric) {
    return (alphanumeric as any)[locale].test(str);
  }
  throw new Error(`Invalid locale '${locale}'`);
};

export const alphanumericLocales = Object.keys(alphanumeric);
