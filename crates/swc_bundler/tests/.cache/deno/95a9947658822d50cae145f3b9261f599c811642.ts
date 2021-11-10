// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/util/hash.ts


export function iconHashToBigInt(hash: string) {
  let animated = false;

  if (hash.startsWith("a_")) {
    animated = true;
    hash = hash.substring(2);
  }

  return {
    animated,
    bigint: BigInt(`0x${hash}`),
  };
}

export function iconBigintToHash(icon: bigint, animated = true) {
  const hash = icon.toString(16);
  return `${animated ? "a_" : ""}${hash}`;
}
