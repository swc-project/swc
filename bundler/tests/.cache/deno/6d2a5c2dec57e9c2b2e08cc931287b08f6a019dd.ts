// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isFloat.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';
// @ts-ignore allowing typedoc to build
import { decimal } from '../helpers/alpha.ts';

type FloatOptions = {
  locale?: string;

  min?: number;
  max?: number;
  lt?: number;
  gt?: number;
};

export const isFloat = (str: string, options?: FloatOptions) => {
  assertString(str);
  options = options || {};
  const float = new RegExp(
    `^(?:[-+])?(?:[0-9]+)?(?:\\${
      options.locale ? (decimal as any)[options.locale] : '.'
    }[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`
  );

  if (str === '' || str === '.' || str === '-' || str === '+') {
    return false;
  }

  const value = parseFloat(str.replace(',', '.'));
  return (
    float.test(str) &&
    (!options.min || value >= options.min) &&
    (!options.max || value <= options?.max) &&
    (!options.lt || value < options?.lt) &&
    (!options.gt || value > options?.gt)
  );
};

export const decimalLocales = Object.keys(decimal);
