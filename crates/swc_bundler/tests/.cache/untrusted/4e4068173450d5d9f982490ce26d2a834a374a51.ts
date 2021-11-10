// Loaded from https://raw.githubusercontent.com/deno-postgres/deno-postgres/master/query/encode.ts


function pad(number: number, digits: number): string {
  let padded = "" + number;
  while (padded.length < digits) {
    padded = "0" + padded;
  }
  return padded;
}

function encodeDate(date: Date): string {
  // Construct ISO date
  const year = pad(date.getFullYear(), 4);
  const month = pad(date.getMonth() + 1, 2);
  const day = pad(date.getDate(), 2);
  const hour = pad(date.getHours(), 2);
  const min = pad(date.getMinutes(), 2);
  const sec = pad(date.getSeconds(), 2);
  const ms = pad(date.getMilliseconds(), 3);

  const encodedDate = `${year}-${month}-${day}T${hour}:${min}:${sec}.${ms}`;

  // Construct timezone info
  //
  // Date.prototype.getTimezoneOffset();
  //
  // From MDN:
  // > The time-zone offset is the difference, in minutes, from local time to UTC.
  // > Note that this means that the offset is positive if the local timezone is
  // > behind UTC and negative if it is ahead. For example, for time zone UTC+10:00
  // > (Australian Eastern Standard Time, Vladivostok Time, Chamorro Standard Time),
  // > -600 will be returned.
  const offset = date.getTimezoneOffset();
  const tzSign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const tzHours = pad(Math.floor(absOffset / 60), 2);
  const tzMinutes = pad(Math.floor(absOffset % 60), 2);

  const encodedTz = `${tzSign}${tzHours}:${tzMinutes}`;

  return encodedDate + encodedTz;
}

function escapeArrayElement(value: unknown): string {
  // deno-lint-ignore no-explicit-any
  const strValue = (value as any).toString();
  const escapedValue = strValue.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  return `"${escapedValue}"`;
}

function encodeArray(array: Array<unknown>): string {
  let encodedArray = "{";

  array.forEach((element, index) => {
    if (index > 0) {
      encodedArray += ",";
    }

    if (element === null || typeof element === "undefined") {
      encodedArray += "NULL";
    } else if (Array.isArray(element)) {
      encodedArray += encodeArray(element);
    } else if (element instanceof Uint8Array) {
      // TODO: it should be encoded as bytea?
      throw new Error("Can't encode array of buffers.");
    } else {
      const encodedElement = encode(element);
      encodedArray += escapeArrayElement(encodedElement as string);
    }
  });

  encodedArray += "}";
  return encodedArray;
}

function encodeBytes(value: Uint8Array): string {
  const hex = Array.from(value)
    .map((val) => (val < 10 ? `0${val.toString(16)}` : val.toString(16)))
    .join("");
  return `\\x${hex}`;
}

export type EncodedArg = null | string | Uint8Array;

export function encode(value: unknown): EncodedArg {
  if (value === null || typeof value === "undefined") {
    return null;
  } else if (value instanceof Uint8Array) {
    return encodeBytes(value);
  } else if (value instanceof Date) {
    return encodeDate(value);
  } else if (value instanceof Array) {
    return encodeArray(value);
  } else if (value instanceof Object) {
    return JSON.stringify(value);
  } else {
    // deno-lint-ignore no-explicit-any
    return (value as any).toString();
  }
}
