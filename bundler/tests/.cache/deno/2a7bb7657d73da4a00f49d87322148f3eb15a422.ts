// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/rsa/rsa_js.ts


import {
  rsa_oaep_encrypt,
  rsa_pkcs1_encrypt,
  rsa_oaep_decrypt,
  rsa_pkcs1_decrypt,
  rsa_pkcs1_verify,
  rsa_pkcs1_sign,
} from "./rsa_internal.ts";
import { RawBinary } from "./../binary.ts";
import type { RSAOption, RSASignOption } from "./common.ts";
import { createHash } from "../hash.ts";
import type { RSAKey } from "./rsa_key.ts";

export class PureRSA {
  static async encrypt(key: RSAKey, message: Uint8Array, options: RSAOption) {
    if (!key.e) throw "Invalid RSA key";

    if (options.padding === "oaep") {
      return new RawBinary(rsa_oaep_encrypt(
        key.length,
        key.n,
        key.e,
        message,
        options.hash,
      ));
    } else if (options.padding === "pkcs1") {
      return new RawBinary(
        rsa_pkcs1_encrypt(key.length, key.n, key.e, message),
      );
    }

    throw "Invalid parameters";
  }

  static async decrypt(key: RSAKey, ciper: Uint8Array, options: RSAOption) {
    if (!key.d) throw "Invalid RSA key";

    if (options.padding === "oaep") {
      return new RawBinary(rsa_oaep_decrypt(
        key.length,
        key.n,
        key.d,
        ciper,
        options.hash,
      ));
    } else if (options.padding === "pkcs1") {
      return new RawBinary(
        rsa_pkcs1_decrypt(key.length, key.n, key.d, ciper),
      );
    }

    throw "Invalid parameters";
  }

  static async verify(
    key: RSAKey,
    signature: Uint8Array,
    message: Uint8Array,
    options: RSASignOption,
  ) {
    if (!key.e) throw "Invalid RSA key";

    return rsa_pkcs1_verify(
      key.length,
      key.n,
      key.e,
      signature,
      createHash(options.hash).update(message).digest(),
    );
  }

  static async sign(key: RSAKey, message: Uint8Array, options: RSASignOption) {
    if (!key.d) throw "You need private key to sign the message";

    return rsa_pkcs1_sign(
      key.length,
      key.n,
      key.d,
      createHash(options.hash).update(message).digest(),
    );
  }
}
