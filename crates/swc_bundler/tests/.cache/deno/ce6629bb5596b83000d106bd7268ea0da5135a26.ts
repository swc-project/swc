// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/util/bigint.ts


export function snowflakeToBigint(snowflake: string) {
  return BigInt(snowflake) | 0n;
}

export function bigintToSnowflake(snowflake: bigint) {
  return snowflake === 0n ? "" : snowflake.toString();
}
