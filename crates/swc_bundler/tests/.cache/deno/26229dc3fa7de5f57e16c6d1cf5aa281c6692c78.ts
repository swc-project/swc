// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isDivisibleBy.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';
// @ts-ignore allowing typedoc to build
import { toFloat } from '../helpers/toFloat.ts';

export const isDivisibleBy = (str: string, num: string) => {
  assertString(str);

  return toFloat(str) % parseInt(num, 10) === 0;
};
