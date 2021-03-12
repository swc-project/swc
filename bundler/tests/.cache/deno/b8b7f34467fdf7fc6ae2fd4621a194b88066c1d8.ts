// Loaded from https://deno.land/x/mysql/src/auth.ts


import { createHash, encode, SupportedAlgorithm } from "../deps.ts";
import { xor } from "./util.ts";

function hash(algorithm: SupportedAlgorithm, data: Uint8Array): Uint8Array {
  return new Uint8Array(createHash(algorithm).update(data).digest());
}

function mysqlNativePassword(password: string, seed: Uint8Array): Uint8Array {
  const pwd1 = hash("sha1", encode(password));
  const pwd2 = hash("sha1", pwd1);

  let seedAndPwd2 = new Uint8Array(seed.length + pwd2.length);
  seedAndPwd2.set(seed);
  seedAndPwd2.set(pwd2, seed.length);
  seedAndPwd2 = hash("sha1", seedAndPwd2);

  return xor(seedAndPwd2, pwd1);
}

function cachingSha2Password(password: string, seed: Uint8Array): Uint8Array {
  const stage1 = hash("sha256", encode(password));
  const stage2 = hash("sha256", stage1);
  const stage3 = hash("sha256", Uint8Array.from([...stage2, ...seed]));
  return xor(stage1, stage3);
}

export default function auth(
  authPluginName: string,
  password: string,
  seed: Uint8Array,
) {
  switch (authPluginName) {
    case "mysql_native_password":
      return mysqlNativePassword(password, seed);

    case "caching_sha2_password":
      return cachingSha2Password(password, seed);
    default:
      throw new Error("Not supported");
  }
}
