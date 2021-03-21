// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isLocale.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const localeReg = /^[A-z]{2,4}([_-]([A-z]{4}|[\d]{3}))?([_-]([A-z]{2}|[\d]{3}))?$/;

export const isLocale = (str: string) => {
  assertString(str);

  if (str === 'en_US_POSIX' || str === 'ca_ES_VALENCIA') {
    return true;
  }

  return localeReg.test(str);
};
