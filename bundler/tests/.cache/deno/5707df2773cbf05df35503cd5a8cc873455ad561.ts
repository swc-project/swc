// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isByteLength.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

type ByteLengthOptions = {
  /**
   * @default 0
   */
  min?: number;

  /**
   * @default undefined
   */
  max?: number;
};

/**
 * @ignore
 */
const defaultByteLengthOptions: ByteLengthOptions = {
  min: 0,
};

export const isByteLength = (str: string, options?: ByteLengthOptions) => {
  assertString(str);

  options = { ...defaultByteLengthOptions, ...options };
  let { min, max } = options;

  // force min to be 0 if undefined
  min = min || 0;

  const len = encodeURI(str).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
};
