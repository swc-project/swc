// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isHsl.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const hslcomma = /^(hsl)a?\(\s*((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?))(deg|grad|rad|turn|\s*)(\s*,\s*(\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%){2}\s*(,\s*((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%?)\s*)?\)$/i;

/**
 * @ignore
 */
const hslspace = /^(hsl)a?\(\s*((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?))(deg|grad|rad|turn|\s)(\s*(\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%){2}\s*(\/\s*((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%?)\s*)?\)$/i;

export const isHSL = (str: string) => {
  assertString(str);
  return hslcomma.test(str) || hslspace.test(str);
};
