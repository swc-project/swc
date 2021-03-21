// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/binary.ts


export class RawBinary extends Uint8Array {
  hex() {
    return [...this].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  binary(): Uint8Array {
    return this;
  }

  base64(): string {
    return btoa(String.fromCharCode.apply(null, [...this]));
  }

  base64url(): string {
    let a = btoa(String.fromCharCode.apply(null, [...this])).replace(/=/g, "");
    a = a.replace(/\+/g, "-");
    a = a.replace(/\//g, "_");
    return a;
  }

  base32(): string {
    const lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const trim = [0x0, 0x1, 0x3, 0x7, 0xf, 0x1f, 0x3f, 0x7f, 0xff];
    let output = "";
    let bits = 0;
    let current = 0;

    for (let i = 0; i < this.length; i++) {
      current = (current << 8) + this[i];
      bits += 8;

      while (bits >= 5) {
        bits -= 5;
        output += lookup[current >> bits];
        current = current & trim[bits];
      }
    }

    if (bits > 0) {
      output += lookup[current << (5 - bits)];
    }

    return output;
  }

  toString(): string {
    return new TextDecoder().decode(this);
  }
}
