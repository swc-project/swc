// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isSlug.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const charsetRegex = /^[^\s-_](?!.*?[-_]{2,})([a-z0-9-\\]{1,})[^\s]*[^-_\s]$/;

export const isSlug = (str: string) => {
  assertString(str);
  return charsetRegex.test(str);
};
