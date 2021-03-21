// Loaded from https://deno.land/x/mongo@v0.20.0/src/utils/ns.ts


export function parseNamespace(ns: string) {
  const [db, ...rest] = ns.split(".");
  return { db, collection: rest.join(".") };
}
