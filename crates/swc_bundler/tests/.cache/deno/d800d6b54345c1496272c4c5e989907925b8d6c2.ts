// Loaded from https://deno.land/x/status@0.1.0/status.ts


// Copyright 2020 Filippo Rossi. All rights reserved. MIT license.

import * as maps from "./maps.ts";
import * as codes from "./codes.ts";

/**
 * Types.
 * @private
 */
export type Status =
  | string
  | number;

/**
 * Module exports.
 * @public
 */

/**
 * Status code array
 */
status.codes = codes.ALL;

/**
 * Status code to message map
 */
status.message = maps.STATUS_MESSAGES;

/**
 * Status message (UPPER_CASE) to code map
 */
status.code = maps.STATUS_CODES;

/**
 * Status codes for redirects.
 */
status.redirect = {
  [codes.MULTIPLE_CHOICES]: true,
  [codes.MOVED_PERMANENTLY]: true,
  [codes.MOVED_TEMPORARILY]: true,
  [codes.SEE_OTHER]: true,
  [codes.USE_PROXY]: true,
  [codes.TEMPORARY_REDIRECT]: true,
  [codes.PERMANENT_REDIRECT]: true,
};

/**
 * Status codes for empty bodies.
 */
status.empty = {
  [codes.NO_CONTENT]: true,
  [codes.RESET_CONTENT]: true,
  [codes.NOT_MODIFIED]: true,
};

/**
 * Status codes for when you should retry the request.
 */
status.retry = {
  [codes.BAD_GATEWAY]: true,
  [codes.SERVICE_UNAVAILABLE]: true,
  [codes.GATEWAY_TIMEOUT]: true,
};

/**
 * Get the status code. But pretty printed.
 * 
 * Given a number, this will throw if it is not a known status
 * code, otherwise the code will be returned. Given a string,
 * the string will be parsed for a number and return the code
 * if valid, otherwise will lookup the code assuming this is
 * the status message.
 * 
 * Status codes remain the same as status(arg)
 * Status messages are pretty printed:
 * 'INTERNAL_SERVER_ERROR' -> 'Internal Server Error'
 *
 * @param {string|number} code
 * @returns {string|number}
 * @public
 */
status.pretty = function pretty(code: Status): Status {
  const res = status(code);
  if (typeof res === "string") {
    return res.replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  }
  return res;
};

/**
 * Get the status code.
 *
 * Given a number, this will throw if it is not a known status
 * code, otherwise the code will be returned. Given a string,
 * the string will be parsed for a number and return the code
 * if valid, otherwise will lookup the code assuming this is
 * the status message.
 *
 * @param {string|number} code
 * @returns {string|number}
 * @public
 */
export function status(code: Status): Status {
  if (typeof code === "number") {
    if (!status.message[code]) throw new Error("invalid status code: " + code);
    return status.message[code];
  }

  if (typeof code !== "string") {
    throw new TypeError("code must be a number or string");
  }

  var n = parseInt(code, 10);
  if (!isNaN(n)) {
    if (!status.message[n]) throw new Error("invalid status code: " + n);
    return status.message[n];
  }

  // remove prettyness 'inTerNal SeRvEr ErrRor' => 'INTERNAL_SERVER_ERROR'
  code = code.trim().replace(/ /g, "_").toUpperCase();
  n = status.code[code];
  if (!n) throw new Error('invalid status message: "' + code + '"');
  return n;
}
