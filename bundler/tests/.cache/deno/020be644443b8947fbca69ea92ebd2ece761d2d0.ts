// Loaded from https://deno.land/x/djwt@v1.9/_signature.ts


import type { Algorithm } from "./_algorithm.ts";
import {
  base64url,
  convertHexToUint8Array,
  HmacSha256,
  HmacSha512,
  RSA,
} from "./_depts.ts";

function assertNever(alg: never, message: string): never {
  throw new RangeError(message);
}

export function convertHexToBase64url(input: string): string {
  return base64url.encode(convertHexToUint8Array(input));
}

/**
 * Do a constant time string comparison. Always compare the complete strings
 * against each other to get a constant time. This method does not short-cut
 * if the two string's length differs.
 * CREDIT: https://github.com/Bruce17/safe-compare
 */
function safeCompare(a: string, b: string) {
  const strA = String(a);
  const lenA = strA.length;
  let strB = String(b);
  let result = 0;

  if (lenA !== strB.length) {
    strB = strA;
    result = 1;
  }

  for (var i = 0; i < lenA; i++) {
    result |= (strA.charCodeAt(i) ^ strB.charCodeAt(i));
  }

  return result === 0;
}

async function encrypt(
  algorithm: Algorithm,
  key: string,
  message: string,
): Promise<string> {
  switch (algorithm) {
    case "none":
      return "";
    case "HS256":
      return new HmacSha256(key).update(message).toString();
    case "HS512":
      return new HmacSha512(key).update(message).toString();
    case "RS256":
      return (
        await new RSA(RSA.parseKey(key)).sign(message, { hash: "sha256" })
      ).hex();
    default:
      assertNever(
        algorithm,
        "no matching crypto algorithm in the header: " + algorithm,
      );
  }
}

export async function create(
  algorithm: Algorithm,
  key: string,
  input: string,
): Promise<string> {
  return convertHexToBase64url(await encrypt(algorithm, key, input));
}

export async function verify({
  signature,
  key,
  algorithm,
  signingInput,
}: {
  signature: string;
  key: string;
  algorithm: Algorithm;
  signingInput: string;
}): Promise<boolean> {
  switch (algorithm) {
    case "none":
    case "HS256":
    case "HS512": {
      return safeCompare(
        signature,
        (await encrypt(algorithm, key, signingInput)),
      );
    }
    case "RS256": {
      return await new RSA(RSA.parseKey(key)).verify(
        convertHexToUint8Array(signature),
        signingInput,
        { hash: "sha256" },
      );
    }
    default:
      assertNever(
        algorithm,
        "no matching crypto algorithm in the header: " + algorithm,
      );
  }
}
