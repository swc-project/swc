// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isSemVer.ts


// @ts-ignore allowing typedoc to build
import { multilineRegexp } from '../helpers/multilineRegex.ts';
// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * Regular Expression to match
 * semantic versioning (SemVer)
 * built from multi-line, multi-parts regexp
 * Reference: https://semver.org/
 */
/**
 * @ignore
 */
const semanticVersioningRegex = multilineRegexp([
  '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)',
  '(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))',
  '?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
]);

export const isSemVer = (str: string) => {
  assertString(str);

  return semanticVersioningRegex.test(str);
};
