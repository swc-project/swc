// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/rsa/rsa_wc.ts


import type { RSAOption } from "./common.ts";
import type { RSAKey } from "./rsa_key.ts";

function big_base64(m?: bigint) {
  if (m === undefined) return undefined;

  const bytes = [];

  while (m > 0n) {
    bytes.push(Number(m & 255n));
    m = m >> 8n;
  }

  bytes.reverse();
  let a = btoa(String.fromCharCode.apply(null, bytes)).replace(/=/g, "");
  a = a.replace(/\+/g, "-");
  a = a.replace(/\//g, "_");
  return a;
}

function getHashFunctionName(hash: string) {
  if (hash === "sha1") return "SHA-1";
  if (hash === "sha256") return "SHA-256";
  return "";
}

async function createWebCryptoKey(
  key: RSAKey,
  usage: string,
  options: RSAOption,
) {
  let jwk: any = {
    kty: "RSA",
    n: big_base64(key.n),
    ext: true,
  };

  if (usage === "encrypt") {
    jwk = { ...jwk, e: big_base64(key.e) };
  } else if (usage === "decrypt") {
    jwk = {
      ...jwk,
      d: big_base64(key.d),
      e: big_base64(key.e),
      p: big_base64(key.p),
      q: big_base64(key.q),
      dp: big_base64(key.dp),
      dq: big_base64(key.dq),
      qi: big_base64(key.qi),
    };
  }

  // @ts-ignore
  return await crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-OAEP",
      hash: { name: getHashFunctionName(options.hash) },
    },
    false,
    [usage],
  );
}

export class WebCryptoRSA {
  key: RSAKey;
  options: RSAOption;
  encryptedKey: any = null;
  decryptedKey: any = null;

  constructor(key: RSAKey, options: RSAOption) {
    this.key = key;
    this.options = options;
  }

  static isSupported(options: RSAOption) {
    if (!crypto.subtle) return false;
    if (options.padding !== "oaep") return false;
    return true;
  }

  static async encrypt(key: RSAKey, m: Uint8Array, options: RSAOption) {
    // @ts-ignore
    return await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      await createWebCryptoKey(key, "encrypt", options),
      m,
    );
  }

  static async decrypt(key: RSAKey, m: Uint8Array, options: RSAOption) {
    // @ts-ignore
    return await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      await createWebCryptoKey(key, "decrypt", options),
      m,
    );
  }
}
