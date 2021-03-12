// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/hash.ts


import { sha1 } from "https://denopkg.com/chiefbiiko/sha1@v1.0.3/mod.ts";
import { sha256 } from "https://denopkg.com/chiefbiiko/sha256@v1.0.2/mod.ts";

export function createHash(algorithm: string) {
  return new class {
    protected m: Uint8Array = new Uint8Array();

    public update(b: Uint8Array) {
      this.m = b;
      return this;
    }

    public digest() {
      if (algorithm === "sha1") {
        return sha1(this.m) as Uint8Array;
      } else if (algorithm === "sha256") {
        return sha256(this.m) as Uint8Array;
      }

      throw "Unsupport hash algorithm";
    }
  }();
}
