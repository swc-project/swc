// Loaded from https://deno.land/x/djwt@v1.9/mod.ts


import { base64url, convertUint8ArrayToHex } from "./_depts.ts";
import {
  create as createSignature,
  verify as verifySignature,
} from "./_signature.ts";
import { verify as verifyAlgorithm } from "./_algorithm.ts";

import type { Algorithm, AlgorithmInput } from "./_algorithm.ts";

/*
 * JWT §4.1: The following Claim Names are registered in the IANA
 * "JSON Web Token Claims" registry established by Section 10.1. None of the
 * claims defined below are intended to be mandatory to use or implement in all
 * cases, but rather they provide a starting point for a set of useful,
 * interoperable claims.
 * Applications using JWTs should define which specific claims they use and when
 * they are required or optional.
 */
export interface Payload {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

/*
 * JWS §4.1.1: The "alg" value is a case-sensitive ASCII string containing a
 * StringOrURI value. This Header Parameter MUST be present and MUST be
 * understood and processed by implementations.
 */
export interface Header {
  alg: Algorithm;
  [key: string]: unknown;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/*
 * Helper function: getNumericDate()
 * returns the number of seconds since January 1, 1970, 00:00:00 UTC
 */
export function getNumericDate(exp: number | Date): number {
  return Math.round(
    (exp instanceof Date ? exp.getTime() : Date.now() + exp * 1000) / 1000,
  );
}

/*
 * JWT §4.1.4: Implementers MAY provide for some small leeway to account for
 * clock skew.
 */
function isExpired(exp: number, leeway = 0): boolean {
  return exp + leeway < Date.now() / 1000;
}

function isTooEarly(nbf: number, leeway = 0): boolean {
  return nbf - leeway > Date.now() / 1000;
}

function isObject(obj: unknown) {
  return (
    obj !== null && typeof obj === "object" && Array.isArray(obj) === false
  );
}

function hasValidExpAndNbfClaims(claimValue: unknown) {
  return claimValue !== undefined ? typeof claimValue === "number" : true;
}

export function decode(
  jwt: string,
): {
  header: Header;
  payload: Payload;
  signature: string;
} {
  const parsedArray = jwt
    .split(".")
    .map(base64url.decode)
    .map((uint8Array, index) => {
      switch (index) {
        case 0:
        case 1:
          try {
            return JSON.parse(decoder.decode(uint8Array));
          } catch {
            break;
          }
        case 2:
          return convertUint8ArrayToHex(uint8Array);
      }
      throw TypeError("The serialization is invalid.");
    });

  const [header, payload, signature] = parsedArray;

  if (typeof signature !== "string") {
    throw new Error(`The signature is missing.`);
  }

  if (typeof header?.alg !== "string") {
    throw new Error(`The header 'alg' parameter must be a string.`);
  }

  /*
   * JWT §7.2: Verify that the resulting octet sequence is a UTF-8-encoded
   * representation of a completely valid JSON object conforming to RFC 7159;
   * let the JWT Claims Set be this JSON object.
   */
  if (!isObject(payload)) {
    throw new Error(`The jwt claims set is not a JSON object.`);
  }

  if (
    !hasValidExpAndNbfClaims(payload.exp) ||
    !hasValidExpAndNbfClaims(payload.nbf)
  ) {
    throw new Error(`The jwt has an invalid 'exp' or 'nbf' claim.`);
  }

  if (
    typeof payload.exp === "number" &&
    isExpired(payload.exp, 1)
  ) {
    throw RangeError("The jwt is expired.");
  }

  if (
    typeof payload.nbf === "number" &&
    isTooEarly(payload.nbf, 1)
  ) {
    throw RangeError("The jwt is used too early.");
  }

  return {
    header,
    payload,
    signature,
  };
}

export async function verify(
  jwt: string,
  key: string,
  algorithm: AlgorithmInput,
): Promise<Payload> {
  const { header, payload, signature } = decode(jwt);

  if (!verifyAlgorithm(algorithm, header.alg)) {
    throw new Error(
      `The jwt's algorithm does not match the specified algorithm '${algorithm}'.`,
    );
  }

  /*
   * JWS §4.1.11: The "crit" (critical) Header Parameter indicates that
   * extensions to this specification and/or [JWA] are being used that MUST be
   * understood and processed.
   */
  if ("crit" in header) {
    throw new Error(
      "The 'crit' header parameter is currently not supported by this module.",
    );
  }

  if (
    !(await verifySignature({
      signature,
      key,
      algorithm: header.alg,
      signingInput: jwt.slice(0, jwt.lastIndexOf(".")),
    }))
  ) {
    throw new Error(
      "The jwt's signature does not match the verification signature.",
    );
  }

  return payload;
}

/*
 * JWT §3: JWTs represent a set of claims as a JSON object that is encoded in
 * a JWS and/or JWE structure. This JSON object is the JWT Claims Set.
 * JSW §7.1: The JWS Compact Serialization represents digitally signed or MACed
 * content as a compact, URL-safe string. This string is:
 *       BASE64URL(UTF8(JWS Protected Header)) || '.' ||
 *       BASE64URL(JWS Payload) || '.' ||
 *       BASE64URL(JWS Signature)
 */
function createSigningInput(header: Header, payload: Payload): string {
  return `${base64url.encode(encoder.encode(JSON.stringify(header)))}.${
    base64url.encode(encoder.encode(JSON.stringify(payload)))
  }`;
}

export async function create(
  header: Header,
  payload: Payload,
  key: string,
): Promise<string> {
  const signingInput = createSigningInput(header, payload);
  const signature = await createSignature(header.alg, key, signingInput);

  return `${signingInput}.${signature}`;
}
