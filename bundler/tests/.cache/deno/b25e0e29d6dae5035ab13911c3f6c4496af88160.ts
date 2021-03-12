// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isLatLong.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;

/**
 * @ignore
 */
const long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/;

/**
 * @ignore
 */
const latDMS = /^(([1-8]?\d)\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|90\D+0\D+0)\D+[NSns]?$/i;

/**
 * @ignore
 */
const longDMS = /^\s*([1-7]?\d{1,2}\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|180\D+0\D+0)\D+[EWew]?$/i;

type LatLongOptions = {
  checkDMS?: boolean;
};

/**
 * @ignore
 */
const defaultLatLongOptions = {
  checkDMS: false,
};

export const isLatLong = (str: string, options?: LatLongOptions) => {
  assertString(str);
  options = {
    ...defaultLatLongOptions,
    ...options,
  };

  if (!str.includes(',')) return false;
  const pair = str.split(',');
  if (
    (pair[0].startsWith('(') && !pair[1].endsWith(')')) ||
    (pair[1].endsWith(')') && !pair[0].startsWith('('))
  )
    return false;

  if (options.checkDMS) {
    return latDMS.test(pair[0]) && longDMS.test(pair[1]);
  }
  return lat.test(pair[0]) && long.test(pair[1]);
};
