// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isJWT.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';
// @ts-ignore allowing typedoc to build
import { isBase64 } from './isBase64.ts';

export const isJWT = (str: string) => {
  assertString(str);

  const dotSplit = str.split('.');
  const len = dotSplit.length;

  if (len > 3 || len < 2) {
    return false;
  }

  return dotSplit.reduce(
    (acc, currElem) => acc && isBase64(currElem, { urlSafe: true }),
    true
  );
};
