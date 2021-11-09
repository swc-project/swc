// Loaded from https://deno.land/x/mongo@v0.20.0/src/utils/bson.ts


import { Bson } from "../../deps.ts";

export function serializeBson(target: Bson.Document): Uint8Array {
  return Bson.serialize(target);
}

export function deserializeBson(buffer: Uint8Array): Bson.Document {
  return Bson.deserialize(buffer);
}

export function ObjectId(oid: string): Bson.ObjectId {
  return new Bson.ObjectID(oid);
}
