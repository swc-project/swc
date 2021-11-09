// Loaded from https://deno.land/x/mysql/src/packets/builders/query.ts


import { encode, replaceParams } from "../../../deps.ts";
import { BufferWriter } from "../../buffer.ts";

/** @ignore */
export function buildQuery(sql: string, params: any[] = []): Uint8Array {
  const data = encode(replaceParams(sql, params));
  const writer = new BufferWriter(new Uint8Array(data.length + 1));
  writer.write(0x03);
  writer.writeBuffer(data);
  return writer.buffer;
}
