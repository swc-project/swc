// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isRFC3339.ts


/* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */

// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const dateFullYear = /[0-9]{4}/;

/**
 * @ignore
 */
const dateMonth = /(0[1-9]|1[0-2])/;

/**
 * @ignore
 */
const dateMDay = /([12]\d|0[1-9]|3[01])/;

/**
 * @ignore
 */
const timeHour = /([01][0-9]|2[0-3])/;

/**
 * @ignore
 */
const timeMinute = /[0-5][0-9]/;

/**
 * @ignore
 */
const timeSecond = /([0-5][0-9]|60)/;

/**
 * @ignore
 */
const timeSecFrac = /(\.[0-9]+)?/;

/**
 * @ignore
 */
const timeNumOffset = new RegExp(`[-+]${timeHour.source}:${timeMinute.source}`);

/**
 * @ignore
 */
const timeOffset = new RegExp(`([zZ]|${timeNumOffset.source})`);

/**
 * @ignore
 */
const partialTime = new RegExp(
  `${timeHour.source}:${timeMinute.source}:${timeSecond.source}${timeSecFrac.source}`
);

/**
 * @ignore
 */
const fullDate = new RegExp(
  `${dateFullYear.source}-${dateMonth.source}-${dateMDay.source}`
);

/**
 * @ignore
 */
const fullTime = new RegExp(`${partialTime.source}${timeOffset.source}`);

/**
 * @ignore
 */
const rfc3339 = new RegExp(`${fullDate.source}[ tT]${fullTime.source}`);

export const isRFC3339 = (str: string) => {
  assertString(str);
  return rfc3339.test(str);
};
