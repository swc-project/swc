// Loaded from https://deno.land/x/mysql/src/auth_plugin/crypt.ts


import { RSA } from "https://deno.land/x/god_crypto@v0.2.0/mod.ts";
function encryptWithPublicKey(key: string, data: Uint8Array): Uint8Array {
  const publicKey = RSA.parseKey(key);
  return RSA.encrypt(data, publicKey);
}

export { encryptWithPublicKey };
