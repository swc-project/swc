// Loaded from https://deno.land/x/mysql/src/buffer.ts


import { decode, encode } from "../deps.ts";

/** @ignore */
export class BufferReader {
  private pos: number = 0;
  constructor(readonly buffer: Uint8Array) {}

  get finished(): boolean {
    return this.pos >= this.buffer.length;
  }

  skip(len: number): BufferReader {
    this.pos += len;
    return this;
  }

  readBuffer(len: number): Uint8Array {
    const buffer = this.buffer.slice(this.pos, this.pos + len);
    this.pos += len;
    return buffer;
  }

  readUints(len: number): number {
    let num = 0;
    for (let n = 0; n < len; n++) {
      num += this.buffer[this.pos++] << (8 * n);
    }
    return num;
  }

  readUint8(): number {
    return this.buffer[this.pos++];
  }

  readUint16(): number {
    return this.readUints(2);
  }

  readUint32(): number {
    return this.readUints(4);
  }

  readUint64(): number {
    return this.readUints(8);
  }

  readNullTerminatedString(): string {
    let end = this.buffer.indexOf(0x00, this.pos);
    if (end === -1) end = this.buffer.length;
    const buf = this.buffer.slice(this.pos, end);
    this.pos += buf.length + 1;
    return decode(buf);
  }

  readString(len: number): string {
    const str = decode(this.buffer.slice(this.pos, this.pos + len));
    this.pos += len;
    return str;
  }

  readEncodedLen(): number {
    const first = this.readUint8();
    if (first < 251) {
      return first;
    } else {
      if (first == 0xfc) {
        return this.readUint16();
      } else if (first == 0xfd) {
        return this.readUints(3);
      } else if (first == 0xfe) {
        return this.readUints(8);
      }
    }
    return -1;
  }

  readLenCodeString(): string | null {
    const len = this.readEncodedLen();
    if (len == -1) return null;
    return this.readString(len);
  }
}

/** @ignore */
export class BufferWriter {
  private pos: number = 0;
  constructor(readonly buffer: Uint8Array) {}

  get wroteData(): Uint8Array {
    return this.buffer.slice(0, this.pos);
  }

  get length(): number {
    return this.pos;
  }

  get capacity(): number {
    return this.buffer.length - this.pos;
  }

  skip(len: number): BufferWriter {
    this.pos += len;
    return this;
  }

  writeBuffer(buffer: Uint8Array): BufferWriter {
    if (buffer.length > this.capacity) {
      buffer = buffer.slice(0, this.capacity);
    }
    this.buffer.set(buffer, this.pos);
    this.pos += buffer.length;
    return this;
  }

  write(byte: number): BufferWriter {
    this.buffer[this.pos++] = byte;
    return this;
  }

  writeInt16LE(num: number) {}

  writeIntLE(num: number, len: number) {
    const int = new Int32Array(1);
    int[0] = 40;
    console.log(int);
  }

  writeUint16(num: number): BufferWriter {
    return this.writeUints(2, num);
  }

  writeUint32(num: number): BufferWriter {
    return this.writeUints(4, num);
  }

  writeUint64(num: number): BufferWriter {
    return this.writeUints(8, num);
  }

  writeUints(len: number, num: number): BufferWriter {
    for (let n = 0; n < len; n++) {
      this.buffer[this.pos++] = (num >> (n * 8)) & 0xff;
    }
    return this;
  }

  writeNullTerminatedString(str: string): BufferWriter {
    return this.writeString(str).write(0x00);
  }

  writeString(str: string): BufferWriter {
    const buf = encode(str);
    this.buffer.set(buf, this.pos);
    this.pos += buf.length;
    return this;
  }
}
