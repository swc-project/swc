// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isLength.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

type LengthOptions = {
  min?: number;
  max?: number;
};

export const isLength = (str: string, options?: LengthOptions) => {
  assertString(str);

  const min = options?.min || 0;
  const max = options?.max;

  const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
  const len = str.length - surrogatePairs.length;
  return len >= min && (typeof max === 'undefined' || len <= max);
};
