// Loaded from https://raw.githubusercontent.com/deno-postgres/deno-postgres/master/connection/packet_reader.ts


import { readInt16BE, readInt32BE } from "../utils.ts";

export class PacketReader {
  private offset = 0;
  private decoder: TextDecoder = new TextDecoder();

  constructor(private buffer: Uint8Array) {}

  readInt16(): number {
    const value = readInt16BE(this.buffer, this.offset);
    this.offset += 2;
    return value;
  }

  readInt32(): number {
    const value = readInt32BE(this.buffer, this.offset);
    this.offset += 4;
    return value;
  }

  readByte(): number {
    return this.readBytes(1)[0];
  }

  readBytes(length: number): Uint8Array {
    const start = this.offset;
    const end = start + length;
    const slice = this.buffer.slice(start, end);
    this.offset = end;
    return slice;
  }

  readString(length: number): string {
    const bytes = this.readBytes(length);
    return this.decoder.decode(bytes);
  }

  readCString(): string {
    const start = this.offset;
    // find next null byte
    const end = this.buffer.indexOf(0, start);
    const slice = this.buffer.slice(start, end);
    // add +1 for null byte
    this.offset = end + 1;
    return this.decoder.decode(slice);
  }
}
