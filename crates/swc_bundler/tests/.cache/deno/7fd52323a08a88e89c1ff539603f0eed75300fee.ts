// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isAfter.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';
// @ts-ignore allowing typedoc to build
import { toDate } from '../helpers/toDate.ts';

export const isAfter = (str: string, date = String(new Date())) => {
  assertString(str);

  const comparison = toDate(date);
  const original = toDate(str);

  // this is against standardx and gts but it converts it into a boolean
  // cannot use the toBoolean method here, as it expects a string
  return !!(original && comparison && original > comparison);
};
