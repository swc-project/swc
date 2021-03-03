// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isHexColor.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;

export const isHexColor = (str: string) => {
  assertString(str);
  return hexcolor.test(str);
};
