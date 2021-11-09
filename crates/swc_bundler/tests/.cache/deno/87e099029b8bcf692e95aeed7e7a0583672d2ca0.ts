// Loaded from https://deno.land/x/oak@v6.3.1/httpError.ts


/*!
 * Adapted directly from http-errors at https://github.com/jshttp/http-errors
 * which is licensed as follows:
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Jonathan Ong me@jongleberry.com
 * Copyright (c) 2016 Douglas Christopher Wilson doug@somethingdoug.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { Status, STATUS_TEXT } from "./deps.ts";
import type { ErrorStatus } from "./types.d.ts";

const errorStatusMap = {
  "BadRequest": 400,
  "Unauthorized": 401,
  "PaymentRequired": 402,
  "Forbidden": 403,
  "NotFound": 404,
  "MethodNotAllowed": 405,
  "NotAcceptable": 406,
  "ProxyAuthRequired": 407,
  "RequestTimeout": 408,
  "Conflict": 409,
  "Gone": 410,
  "LengthRequired": 411,
  "PreconditionFailed": 412,
  "RequestEntityTooLarge": 413,
  "RequestURITooLong": 414,
  "UnsupportedMediaType": 415,
  "RequestedRangeNotSatisfiable": 416,
  "ExpectationFailed": 417,
  "Teapot": 418,
  "MisdirectedRequest": 421,
  "UnprocessableEntity": 422,
  "Locked": 423,
  "FailedDependency": 424,
  "UpgradeRequired": 426,
  "PreconditionRequired": 428,
  "TooManyRequests": 429,
  "RequestHeaderFieldsTooLarge": 431,
  "UnavailableForLegalReasons": 451,
  "InternalServerError": 500,
  "NotImplemented": 501,
  "BadGateway": 502,
  "ServiceUnavailable": 503,
  "GatewayTimeout": 504,
  "HTTPVersionNotSupported": 505,
  "VariantAlsoNegotiates": 506,
  "InsufficientStorage": 507,
  "LoopDetected": 508,
  "NotExtended": 510,
  "NetworkAuthenticationRequired": 511,
};

/** A base class for individual classes of HTTP errors. */
export class HttpError extends Error {
  /** Determines if details about the error should be automatically exposed
   * in a response.  This is automatically set to `true` for 4XX errors, as
   * they represent errors in the request, while 5XX errors are set to `false`
   * as they are internal server errors and exposing details could leak
   * important server security information. */
  expose = false;

  /** The HTTP error status associated with this class of error. */
  status = Status.InternalServerError;
}

function createHttpErrorConstructor<E extends typeof HttpError>(
  status: ErrorStatus,
): E {
  const name = `${Status[status]}Error`;
  const Ctor = class extends HttpError {
    constructor(message?: string) {
      super();
      // deno-lint-ignore no-explicit-any
      this.message = message || STATUS_TEXT.get(status as any)!;
      this.status = status;
      this.expose = status >= 400 && status < 500 ? true : false;
      Object.defineProperty(this, "name", {
        configurable: true,
        enumerable: false,
        value: name,
        writable: true,
      });
    }
  };
  return Ctor as E;
}

/** An object which contains an individual HTTP Error for each HTTP status
 * error code (4XX and 5XX).  When errors are raised related to a particular
 * HTTP status code, they will be of the appropriate instance located on this
 * object.  Also, context's `.throw()` will throw errors based on the passed
 * status code. */
export const httpErrors: Record<keyof typeof errorStatusMap, typeof HttpError> =
  // deno-lint-ignore no-explicit-any
  {} as any;

for (const [key, value] of Object.entries(errorStatusMap)) {
  httpErrors[key as keyof typeof errorStatusMap] = createHttpErrorConstructor(
    value,
  );
}

/** Create a specific class of `HttpError` based on the status, which defaults
 * to _500 Internal Server Error_.
 */
export function createHttpError(
  status: ErrorStatus = 500,
  message?: string,
): HttpError {
  return new httpErrors[Status[status] as keyof typeof errorStatusMap](message);
}

// deno-lint-ignore no-explicit-any
export function isHttpError(value: any): value is HttpError {
  return value instanceof HttpError;
}
