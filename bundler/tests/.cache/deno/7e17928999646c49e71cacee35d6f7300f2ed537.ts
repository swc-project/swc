// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isMagnetURI.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const magnetURI = /^magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32,40}&dn=.+&tr=.+$/i;

export const isMagnetURI = (url: string) => {
  assertString(url);
  return magnetURI.test(url.trim());
};
