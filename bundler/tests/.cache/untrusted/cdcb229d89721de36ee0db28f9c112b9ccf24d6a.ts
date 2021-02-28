// Loaded from https://cdn.skypack.dev/-/@octokit/request-error@v2.0.5-M484dtcgyBZagFjx2PkF/dist=es2020,mode=imports/optimized/@octokit/request-error.js


import {Deprecation} from "/-/deprecation@v2.3.1-uvOjAQiALAZPHmrlznlP/dist=es2020,mode=imports/optimized/deprecation.js";
import once2 from "/-/once@v1.4.0-dZva3nt1fLBY6vpXF5Hj/dist=es2020,mode=imports/optimized/once.js";
const logOnce = once2((deprecation2) => console.warn(deprecation2));
class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }
    });
    this.headers = options.headers || {};
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }
}
export {RequestError};
export default null;
