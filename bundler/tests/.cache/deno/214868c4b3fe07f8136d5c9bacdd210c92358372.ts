// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isMongoId.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';
// @ts-ignore allowing typedoc to build
import { isHexadecimal } from './isHexadecimal.ts';

export const isMongoId = (str: string) => {
  assertString(str);
  return isHexadecimal(str) && str.length === 24;
};
