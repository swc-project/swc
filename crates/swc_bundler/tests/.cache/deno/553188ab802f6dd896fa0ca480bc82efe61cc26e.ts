// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/rsa/mod.ts


import type { RSAOption, RSASignOption, JSONWebKey } from "./common.ts";
import { WebCryptoRSA } from "./rsa_wc.ts";
import { PureRSA } from "./rsa_js.ts";
import { RawBinary } from "../binary.ts";
import { rsa_import_key } from "./import_key.ts";
import { RSAKey } from "./rsa_key.ts";

type RSAPublicKeyFormat = [[string, null], [[bigint, bigint]]];

function computeMessage(m: Uint8Array | string) {
  return typeof m === "string" ? new TextEncoder().encode(m) : m;
}

function computeOption(options?: Partial<RSAOption>): RSAOption {
  return {
    hash: "sha1",
    padding: "oaep",
    ...options,
  };
}

export class RSA {
  protected key: RSAKey;

  constructor(key: RSAKey) {
    this.key = key;
  }

  async encrypt(
    m: Uint8Array | string,
    options?: Partial<RSAOption>,
  ) {
    const computedOption = computeOption(options);

    const func = WebCryptoRSA.isSupported(computedOption)
      ? WebCryptoRSA.encrypt
      : PureRSA.encrypt;

    return new RawBinary(
      await func(this.key, computeMessage(m), computedOption),
    );
  }

  async decrypt(
    m: Uint8Array,
    options?: Partial<RSAOption>,
  ) {
    const computedOption = computeOption(options);

    const func = WebCryptoRSA.isSupported(computedOption)
      ? WebCryptoRSA.decrypt
      : PureRSA.decrypt;

    return new RawBinary(
      await func(this.key, m, computedOption),
    );
  }

  async verify(
    signature: Uint8Array,
    message: Uint8Array | string,
    options?: Partial<RSASignOption>,
  ): Promise<boolean> {
    const computedOption: RSASignOption = {
      ...options,
      algorithm: "rsassa-pkcs1-v1_5",
      hash: "sha256",
    };

    return await PureRSA.verify(
      this.key,
      signature,
      computeMessage(message),
      computedOption,
    );
  }

  async sign(
    message: Uint8Array | string,
    options?: Partial<RSASignOption>,
  ): Promise<RawBinary> {
    const computedOption: RSASignOption = {
      ...options,
      algorithm: "rsassa-pkcs1-v1_5",
      hash: "sha256",
    };

    return await PureRSA.sign(
      this.key,
      computeMessage(message),
      computedOption,
    );
  }

  static parseKey(
    key: string | JSONWebKey,
    format: "auto" | "jwk" | "pem" = "auto",
  ): RSAKey {
    return this.importKey(key, format);
  }

  /**
   * Convert key in an external, portable format to our internal key format
   * 
   * @param key String or key containing the key in the given format.
   * @param format is a string describing the data format of the key to import. Choose "auto", it will try to guess the correct format of the given key
   */
  static importKey(
    key: string | JSONWebKey,
    format: "auto" | "jwk" | "pem" = "auto",
  ): RSAKey {
    return new RSAKey(rsa_import_key(key, format));
  }
}
