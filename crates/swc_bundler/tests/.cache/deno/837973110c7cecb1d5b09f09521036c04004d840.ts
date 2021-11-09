// Loaded from https://deno.land/x/fresh@v1.0.0/mod.ts


/*!
 * Based on https://github.com/jshttp/fresh/blob/master/index.js
 * Copyright(c) 2012 TJ Holowaychuk
 * Copyright(c) 2016-2017 Douglas Christopher Wilson
 * Copyright(c) 2020 Christian Norrman
 * MIT Licensed
 */

/**
  * Regex to check if no-cache exists in a Cache-Control header.
  * @constant
  * @private
  */
const CACHE_CONTROL_NO_CACHE_REGEXP = /(?:^|,)\s*?no-cache\s*?(?:,|$)/;

/**
 * Regex to sanitize ETags within a If-None-Match header.
 * @constant
 * @private
 */
const NONE_MATCH_SANITIZE_REGEXP = /(W\/| )/g;

/**
 * Check freshness of the response using request and response headers.
 * @param {Headers} reqHeaders Server request headers object
 * @param {Headers} resHeaders Server response headers object
 *
 * @returns {boolean}
 */
export default function fresh(
  reqHeaders: Headers,
  resHeaders: Headers,
): boolean {
  const modifiedSince = reqHeaders.get("If-Modified-Since");
  const noneMatch = reqHeaders.get("If-None-Match");

  // unconditional request
  if (!modifiedSince && !noneMatch) {
    return false;
  }

  // If-None-Match
  if (noneMatch && noneMatch !== "*") {
    let etag = resHeaders.get("ETag");
    if (!etag) {
      return false;
    } else if (etag.startsWith("W/")) {
      etag = etag.substring(2);
    }

    const etags = noneMatch
      .replace(NONE_MATCH_SANITIZE_REGEXP, "")
      .split(",");

    if (!etags.includes(etag)) {
      return false;
    }
  }

  // If-Modified-Since
  if (modifiedSince) {
    const lastModified = resHeaders.get("Last-Modified");
    if (
      !lastModified || !(Date.parse(lastModified) <= Date.parse(modifiedSince))
    ) {
      return false;
    }
  }

  // Always return stale when Cache-Control: no-cache
  // to support end-to-end reload requests
  // https://tools.ietf.org/html/rfc2616#section-14.9.4
  const cacheControl = reqHeaders.get("Cache-Control");
  if (cacheControl && CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)) {
    return false;
  }

  return true;
}
