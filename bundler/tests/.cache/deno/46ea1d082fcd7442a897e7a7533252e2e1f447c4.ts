// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isLowercase.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

export const isLowercase = (str: string) => {
  assertString(str);
  return str === str.toLowerCase();
};
