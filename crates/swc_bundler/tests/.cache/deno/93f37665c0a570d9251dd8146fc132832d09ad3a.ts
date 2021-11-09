// Loaded from https://deno.land/x/segno@v1.1.0/lib/helpers/toFloat.ts


import { isFloat } from '../validations/isFloat.ts';

export const toFloat = (str: string) => {
  if (!isFloat(str)) return NaN;

  return parseFloat(str);
};
