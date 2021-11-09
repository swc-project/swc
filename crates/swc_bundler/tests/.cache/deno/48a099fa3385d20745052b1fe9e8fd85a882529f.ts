// Loaded from https://deno.land/std@0.101.0/http/cookie.ts


// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// Structured similarly to Go's cookie.go
// https://github.com/golang/go/blob/master/src/net/http/cookie.go
import { assert } from "../_util/assert.ts";
import { toIMF } from "../datetime/mod.ts";

export interface Cookie {
  /** Name of the cookie. */
  name: string;
  /** Value of the cookie. */
  value: string;
  /** Expiration date of the cookie. */
  expires?: Date;
  /** Max-Age of the Cookie. Max-Age must be an integer superior or equal to 0. */
  maxAge?: number;
  /** Specifies those hosts to which the cookie will be sent. */
  domain?: string;
  /** Indicates a URL path that must exist in the request. */
  path?: string;
  /** Indicates if the cookie is made using SSL & HTTPS. */
  secure?: boolean;
  /** Indicates that cookie is not accessible via JavaScript. **/
  httpOnly?: boolean;
  /** Allows servers to assert that a cookie ought not to
   * be sent along with cross-site requests. */
  sameSite?: "Strict" | "Lax" | "None";
  /** Additional key value pairs with the form "key=value" */
  unparsed?: string[];
}

const FIELD_CONTENT_REGEXP = /^(?=[\x20-\x7E]*$)[^()@<>,;:\\"\[\]?={}\s]+$/;

function toString(cookie: Cookie): string {
  if (!cookie.name) {
    return "";
  }
  const out: string[] = [];
  validateName(cookie.name);
  validateValue(cookie.name, cookie.value);
  out.push(`${cookie.name}=${cookie.value}`);

  // Fallback for invalid Set-Cookie
  // ref: https://tools.ietf.org/html/draft-ietf-httpbis-cookie-prefixes-00#section-3.1
  if (cookie.name.startsWith("__Secure")) {
    cookie.secure = true;
  }
  if (cookie.name.startsWith("__Host")) {
    cookie.path = "/";
    cookie.secure = true;
    delete cookie.domain;
  }

  if (cookie.secure) {
    out.push("Secure");
  }
  if (cookie.httpOnly) {
    out.push("HttpOnly");
  }
  if (typeof cookie.maxAge === "number" && Number.isInteger(cookie.maxAge)) {
    assert(
      cookie.maxAge >= 0,
      "Max-Age must be an integer superior or equal to 0",
    );
    out.push(`Max-Age=${cookie.maxAge}`);
  }
  if (cookie.domain) {
    validateDomain(cookie.domain);
    out.push(`Domain=${cookie.domain}`);
  }
  if (cookie.sameSite) {
    out.push(`SameSite=${cookie.sameSite}`);
  }
  if (cookie.path) {
    validatePath(cookie.path);
    out.push(`Path=${cookie.path}`);
  }
  if (cookie.expires) {
    const dateString = toIMF(cookie.expires);
    out.push(`Expires=${dateString}`);
  }
  if (cookie.unparsed) {
    out.push(cookie.unparsed.join("; "));
  }
  return out.join("; ");
}

/**
 * Validate Cookie Name.
 * @param name Cookie name.
 */
function validateName(name: string | undefined | null): void {
  if (name && !FIELD_CONTENT_REGEXP.test(name)) {
    throw new TypeError(`Invalid cookie name: "${name}".`);
  }
}

/**
 * Validate Path Value.
 * @see https://tools.ietf.org/html/rfc6265#section-4.1.2.4
 * @param path Path value.
 */
function validatePath(path: string | null): void {
  if (path == null) {
    return;
  }
  for (let i = 0; i < path.length; i++) {
    const c = path.charAt(i);
    if (
      c < String.fromCharCode(0x20) || c > String.fromCharCode(0x7E) || c == ";"
    ) {
      throw new Error(
        path + ": Invalid cookie path char '" + c + "'",
      );
    }
  }
}

/**
 * Validate Cookie Value.
 * @see https://tools.ietf.org/html/rfc6265#section-4.1
 * @param value Cookie value.
 */
function validateValue(name: string, value: string | null): void {
  if (value == null || name == null) return;
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i);
    if (
      c < String.fromCharCode(0x21) || c == String.fromCharCode(0x22) ||
      c == String.fromCharCode(0x2c) || c == String.fromCharCode(0x3b) ||
      c == String.fromCharCode(0x5c) || c == String.fromCharCode(0x7f)
    ) {
      throw new Error(
        "RFC2616 cookie '" + name + "' cannot have '" + c + "' as value",
      );
    }
    if (c > String.fromCharCode(0x80)) {
      throw new Error(
        "RFC2616 cookie '" + name + "' can only have US-ASCII chars as value" +
          c.charCodeAt(0).toString(16),
      );
    }
  }
}

/**
 * Validate Cookie Domain.
 * @see https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.2.3
 * @param domain Cookie domain.
 */
function validateDomain(domain: string): void {
  if (domain == null) {
    return;
  }
  const char1 = domain.charAt(0);
  const charN = domain.charAt(domain.length - 1);
  if (char1 == "-" || charN == "." || charN == "-") {
    throw new Error(
      "Invalid first/last char in cookie domain: " + domain,
    );
  }
}

/**
 * Parse the cookies of the Server Request
 * @param req An object which has a `headers` property
 */
export function getCookies(req: { headers: Headers }): Record<string, string> {
  const cookie = req.headers.get("Cookie");
  if (cookie != null) {
    const out: Record<string, string> = {};
    const c = cookie.split(";");
    for (const kv of c) {
      const [cookieKey, ...cookieVal] = kv.split("=");
      assert(cookieKey != null);
      const key = cookieKey.trim();
      out[key] = cookieVal.join("=");
    }
    return out;
  }
  return {};
}

/**
 * Set the cookie header properly in the Response
 * @param res An object which has a headers property
 * @param cookie Cookie to set
 *
 * Example:
 *
 * ```ts
 * setCookie(response, { name: 'deno', value: 'runtime',
 *   httpOnly: true, secure: true, maxAge: 2, domain: "deno.land" });
 * ```
 */
export function setCookie(res: { headers?: Headers }, cookie: Cookie): void {
  if (!res.headers) {
    res.headers = new Headers();
  }
  // TODO(zekth) : Add proper parsing of Set-Cookie headers
  // Parsing cookie headers to make consistent set-cookie header
  // ref: https://tools.ietf.org/html/rfc6265#section-4.1.1
  const v = toString(cookie);
  if (v) {
    res.headers.append("Set-Cookie", v);
  }
}

/**
 *  Set the cookie header properly in the Response to delete it
 * @param res Server Response
 * @param name Name of the cookie to Delete
 * Example:
 *
 *     deleteCookie(res,'foo');
 *     deleteCookie(res,'foo', {path:'/demo'});
 *     deleteCookie(res,'foo', {domain:'deno.land'});
 */
export function deleteCookie(
  res: { headers?: Headers },
  name: string,
  attributes?: { path?: string; domain?: string },
): void {
  setCookie(res, {
    name: name,
    value: "",
    expires: new Date(0),
    ...attributes,
  });
}
