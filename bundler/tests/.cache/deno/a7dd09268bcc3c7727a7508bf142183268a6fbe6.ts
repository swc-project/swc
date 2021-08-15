// Loaded from https://deno.land/x/vary@1.0.0/mod.ts


/*!
 * Based on https://github.com/jshttp/vary/blob/master/index.js
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * Copyright(c) 2020 Henry Zhuang
 * MIT Licensed
 */

/**
 * RegExp to match field-name in RFC 7230 sec 3.2
 *
 * field-name    = token
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 */

const FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

/**
 * Append a field to a vary header.
 *
 * @param {String} header
 * @param {String|Array} field
 * @return {String}
 * @public
 */

export function append(header: string, field: string | string[]): string {
  // if (typeof header !== 'string') {
  //   throw new TypeError('header argument is required')
  // }

  // if (!field) {
  //   throw new TypeError('field argument is required')
  // }

  // existing, unspecified vary
  if (header === "*") {
    return header;
  }

  // get fields array
  const fields = !Array.isArray(field) ? parse(String(field)) : field;

  // assert on invalid field names
  for (let j = 0; j < fields.length; j++) {
    if (!FIELD_NAME_REGEXP.test(fields[j])) {
      throw new TypeError(
        `field argument contains an invalid header name \`${fields[j]}\``,
      );
    }
  }

  // enumerate current values
  let val = header;
  const vals = parse(header.toLowerCase());

  // unspecified vary
  if (fields.indexOf("*") !== -1 || vals.indexOf("*") !== -1) {
    return "*";
  }

  for (let i = 0; i < fields.length; i++) {
    const fld = fields[i].toLowerCase();

    // append value (case-preserving)
    if (vals.indexOf(fld) === -1) {
      vals.push(fld);
      val = val ? val + ", " + fields[i] : fields[i];
    }
  }

  return val;
}

/**
 * Parse a vary header into an array.
 *
 * @param {String} header
 * @return {Array}
 * @private
 */

function parse(header: string): string[] {
  let end = 0;
  const list = [];
  let start = 0;

  // gather tokens
  for (let i = 0, len = header.length; i < len; i++) {
    switch (header.charCodeAt(i)) {
      case 0x20:/*   */
        if (start === end) {
          start = end = i + 1;
        }
        break;
      case 0x2c:/* , */
        list.push(header.substring(start, end));
        start = end = i + 1;
        break;
      default:
        end = i + 1;
        break;
    }
  }

  // final token
  list.push(header.substring(start, end));

  return list;
}

/**
 * Mark that a request is varied on a header field.
 *
 * @param {Headers} header
 * @param {String|Array} field
 * @public
 */

export function vary(header: Headers, field: string | string[]): void {
  // get existing header
  let val = header.get("vary") || "";

  // set new header
  if ((val = append(val, field))) {
    header.set("vary", val);
  }
}
