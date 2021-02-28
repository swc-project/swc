// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isBtcAddress.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

// supports Bech32 addresses
/**
 * @ignore
 */
const btc = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;

export const isBtcAddress = (str: string) => {
  assertString(str);
  return btc.test(str);
};
