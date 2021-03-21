// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isBefore.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';
// @ts-ignore allowing typedoc to build
import { toDate } from '../helpers/toDate.ts';

export const isBefore = (str: string, date = String(new Date())) => {
  assertString(str);

  const comparison = toDate(date);
  const original = toDate(str);

  return !!(original && comparison && original < comparison);
};
