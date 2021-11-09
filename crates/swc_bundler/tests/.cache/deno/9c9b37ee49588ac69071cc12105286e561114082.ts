// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isJSON.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

type JSONOptions = {
  allowPrimitives?: boolean;
};

/**
 * @ignore
 */
const defaultJSONOptions = {
  allowPrimitives: false,
};

export const isJSON = (str: string, options?: JSONOptions) => {
  assertString(str);

  try {
    options = { ...defaultJSONOptions, ...options };
    let primitives: Array<boolean | null> = [];
    if (options.allowPrimitives) {
      primitives = [null, false, true];
    }

    const obj = JSON.parse(str);
    return primitives.includes(obj) || (!!obj && typeof obj === 'object');
  } catch (e) {
    /* ignore */
  }
  return false;
};
