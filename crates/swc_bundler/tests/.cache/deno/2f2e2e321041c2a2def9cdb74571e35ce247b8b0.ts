// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isISO8601.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

// from http://goo.gl/0ejHHW
/**
 * @ignore
 */
const iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

/**
 * @ignore
 */
const isValidDate = (str: string) => {
  // str must have passed the ISO8601 check
  // this check is meant to catch invalid dates
  // like 2009-02-31
  // first check for ordinal dates
  const ordinalMatch = str.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/);
  if (ordinalMatch) {
    const oYear = Number(ordinalMatch[1]);
    const oDay = Number(ordinalMatch[2]);
    // if is leap year
    if ((oYear % 4 === 0 && oYear % 100 !== 0) || oYear % 400 === 0)
      return oDay <= 366;
    return oDay <= 365;
  }

  // @ts-ignore allowing typedoc to build
  const match = str.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number);
  const year = match[1];
  const month = match[2];
  const day = match[3];
  const monthString = month ? `0${month}`.slice(-2) : month;
  const dayString = day ? `0${day}`.slice(-2) : day;

  // create a date object and compare
  const d = new Date(`${year}-${monthString || '01'}-${dayString || '01'}`);
  if (month && day) {
    return (
      d.getUTCFullYear() === year &&
      d.getUTCMonth() + 1 === month &&
      d.getUTCDate() === day
    );
  }
  return true;
};

type ISO8601Options = {
  strict?: boolean;
};

export const isISO8601 = (str: string, options?: ISO8601Options) => {
  assertString(str);
  const check = iso8601.test(str);
  if (!options) return check;
  if (check && options.strict) return isValidDate(str);
  return check;
};
