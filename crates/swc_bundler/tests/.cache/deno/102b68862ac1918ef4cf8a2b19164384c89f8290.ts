// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isBoolean.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

export const isBoolean = (str: string) => {
  assertString(str);
  return ['true', 'false', '1', '0'].indexOf(str) >= 0;
};
