// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isHalfWidth.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

export const halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

export const isHalfWidth = (str: string) => {
  assertString(str);
  return halfWidth.test(str);
};
