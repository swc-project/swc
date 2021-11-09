// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isInt.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;

/**
 * @ignore
 */
const intLeadingZeroes = /^[-+]?[0-9]+$/;

type IntOptions = {
  allowLeadingZeroes?: boolean;
  min?: number;
  max?: number;
  lt?: number;
  gt?: number;
};

export const isInt = (str: string, options?: IntOptions) => {
  assertString(str);
  options = options || {};

  // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.
  const regex =
    options.hasOwnProperty('allowLeadingZeroes') && !options.allowLeadingZeroes
      ? int
      : intLeadingZeroes;

  // Check min/max/lt/gt
  // @ts-ignore allowing typedoc to build
  const minCheckPassed = !options.hasOwnProperty('min') || +str >= options.min;
  // @ts-ignore allowing typedoc to build
  const maxCheckPassed = !options.hasOwnProperty('max') || +str <= options.max;
  // @ts-ignore allowing typedoc to build
  const ltCheckPassed = !options.hasOwnProperty('lt') || +str < options.lt;
  // @ts-ignore allowing typedoc to build
  const gtCheckPassed = !options.hasOwnProperty('gt') || +str > options.gt;

  return (
    regex.test(str) &&
    minCheckPassed &&
    maxCheckPassed &&
    ltCheckPassed &&
    gtCheckPassed
  );
};
