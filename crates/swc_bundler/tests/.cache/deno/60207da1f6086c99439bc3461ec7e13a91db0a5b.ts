// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isSurrogatePair.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

export const isSurrogatePair = (str: string) => {
  assertString(str);
  return surrogatePair.test(str);
};
