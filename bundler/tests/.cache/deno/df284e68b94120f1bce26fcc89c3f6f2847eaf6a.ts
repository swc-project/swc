// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isMACAddress.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const macAddress = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

/**
 * @ignore
 */
const macAddressNoColons = /^([0-9a-fA-F]){12}$/;

/**
 * @ignore
 */
const macAddressWithHyphen = /^([0-9a-fA-F][0-9a-fA-F]-){5}([0-9a-fA-F][0-9a-fA-F])$/;

/**
 * @ignore
 */
const macAddressWithSpaces = /^([0-9a-fA-F][0-9a-fA-F]\s){5}([0-9a-fA-F][0-9a-fA-F])$/;

/**
 * @ignore
 */
const macAddressWithDots = /^([0-9a-fA-F]{4}).([0-9a-fA-F]{4}).([0-9a-fA-F]{4})$/;

type MACAddressOptions = {
  noColons?: boolean;
};

export const isMACAddress = (str: string, options?: MACAddressOptions) => {
  assertString(str);

  if (options && options.noColons) {
    return macAddressNoColons.test(str);
  }

  return (
    macAddress.test(str) ||
    macAddressWithHyphen.test(str) ||
    macAddressWithSpaces.test(str) ||
    macAddressWithDots.test(str)
  );
};
