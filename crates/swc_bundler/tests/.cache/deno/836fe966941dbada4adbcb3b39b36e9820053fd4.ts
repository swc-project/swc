// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/rsa/rsa_key.ts


import type { RSAKeyParams, JSONWebKey } from "./common.ts";
import { encode } from "./../../src/utility/encode.ts";
import {
  rsa_export_pkcs8_private,
  rsa_export_pkcs8_public,
} from "./export_key.ts";

export class RSAKey {
  public n: bigint;
  public e?: bigint;
  public d?: bigint;
  public p?: bigint;
  public q?: bigint;
  public dp?: bigint;
  public dq?: bigint;
  public qi?: bigint;
  public length: number;

  constructor(params: RSAKeyParams) {
    this.n = params.n;
    this.e = params.e;
    this.d = params.d;
    this.p = params.p;
    this.q = params.q;
    this.dp = params.dp;
    this.dq = params.dq;
    this.qi = params.qi;
    this.length = params.length;
  }

  public pem(): string {
    if (this.d) {
      return rsa_export_pkcs8_private(this);
    } else {
      return rsa_export_pkcs8_public(this);
    }
  }

  public jwk(): JSONWebKey {
    let jwk: JSONWebKey = {
      kty: "RSA",
      n: encode.bigint(this.n).base64url(),
    };

    if (this.d) jwk = { ...jwk, d: encode.bigint(this.d).base64url() };
    if (this.e) jwk = { ...jwk, e: encode.bigint(this.e).base64url() };
    if (this.p) jwk = { ...jwk, p: encode.bigint(this.p).base64url() };
    if (this.q) jwk = { ...jwk, q: encode.bigint(this.q).base64url() };
    if (this.dp) jwk = { ...jwk, dp: encode.bigint(this.dp).base64url() };
    if (this.dq) jwk = { ...jwk, dq: encode.bigint(this.dq).base64url() };
    if (this.qi) jwk = { ...jwk, qi: encode.bigint(this.qi).base64url() };

    return jwk;
  }
}
