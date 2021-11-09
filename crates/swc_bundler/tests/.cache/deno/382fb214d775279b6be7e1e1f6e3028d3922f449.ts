// Loaded from https://deno.land/x/god_crypto@v0.2.0/src/math.ts


export function power_mod(n: bigint, p: bigint, m: bigint): bigint {
    if (p === 1n) return n;
    if (p % 2n === 0n) {
      const t = power_mod(n, p >> 1n, m);
      return (t * t) % m
    } else {
      const t = power_mod(n, p >> 1n, m);
      return (t * t * n) % m
    }
  }  