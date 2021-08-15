// Loaded from https://deno.land/x/media_typer@1.0.1/mod.ts


/*!
 * Based on https://github.com/jshttp/media-typer/blob/master/index.js
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * Copyright(c) 2020 Henry Zhuang
 * MIT Licensed
 */

/**
 * RegExp to match type in RFC 6838
 *
 * type-name = restricted-name
 * subtype-name = restricted-name
 * restricted-name = restricted-name-first *126restricted-name-chars
 * restricted-name-first  = ALPHA / DIGIT
 * restricted-name-chars  = ALPHA / DIGIT / "!" / "#" /
 *                          "$" / "&" / "-" / "^" / "_"
 * restricted-name-chars =/ "." ; Characters before first dot always
 *                              ; specify a facet name
 * restricted-name-chars =/ "+" ; Characters after last plus always
 *                              ; specify a structured syntax suffix
 * ALPHA =  %x41-5A / %x61-7A   ; A-Z / a-z
 * DIGIT =  %x30-39             ; 0-9
 */
const SUBTYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
const TYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
const TYPE_REGEXP =
  /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;

/**
 * Class for MediaType object.
 */
export interface MediaType {
  type: string;
  subtype: string;
  suffix?: string;
}

/**
 * Format object to media type.
 *
 * @param {MediaType} obj
 * @return {string}
 */
export function format(obj: MediaType): string {
  const subtype = obj.subtype;
  const suffix = obj.suffix;
  const type = obj.type;

  if (!TYPE_NAME_REGEXP.test(type)) {
    throw new TypeError("invalid type");
  }

  if (!SUBTYPE_NAME_REGEXP.test(subtype)) {
    throw new TypeError("invalid subtype");
  }

  // format as type/subtype
  let string = type + "/" + subtype;

  // append +suffix
  if (suffix) {
    if (!TYPE_NAME_REGEXP.test(suffix)) {
      throw new TypeError("invalid suffix");
    }

    string += "+" + suffix;
  }

  return string;
}

/**
 * Test media type.
 *
 * @param {string} string
 * @return {boolean}
 */
export function test(string: string): boolean {
  return TYPE_REGEXP.test(string.toLowerCase());
}

/**
 * Parse media type to object.
 *
 * @param {string} string
 * @return {MediaType}
 */
export function parse(string: string): MediaType {
  console.log("stringstring:", string);

  const match = TYPE_REGEXP.exec(string.toLowerCase());
  console.log("matchmatch:", match);
  if (!match) {
    throw new TypeError("invalid media type");
  }

  const type = match[1];
  let subtype = match[2];
  let suffix;

  // suffix after last +
  const index = subtype.lastIndexOf("+");
  if (index !== -1) {
    suffix = subtype.substr(index + 1);
    subtype = subtype.substr(0, index);
  }

  return new MediaTypeImpl(type, subtype, suffix);
}

class MediaTypeImpl implements MediaType {
  type: string;
  subtype: string;
  suffix?: string;
  constructor(type: string, subtype: string, suffix?: string) {
    this.type = type;
    this.subtype = subtype;
    this.suffix = suffix;
  }
}
