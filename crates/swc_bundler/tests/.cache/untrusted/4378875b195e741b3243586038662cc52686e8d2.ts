// Loaded from https://raw.githubusercontent.com/deno-postgres/deno-postgres/master/connection/packet_writer.ts


/*!
 * Adapted directly from https://github.com/brianc/node-buffer-writer
 * which is licensed as follows:
 *
 * The MIT License (MIT)
 *
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { copy } from "../deps.ts";

export class PacketWriter {
  private size: number;
  private buffer: Uint8Array;
  private offset: number;
  private headerPosition: number;
  private encoder = new TextEncoder();

  constructor(size?: number) {
    this.size = size || 1024;
    this.buffer = new Uint8Array(this.size + 5);
    this.offset = 5;
    this.headerPosition = 0;
  }

  _ensure(size: number) {
    const remaining = this.buffer.length - this.offset;
    if (remaining < size) {
      const oldBuffer = this.buffer;
      // exponential growth factor of around ~ 1.5
      // https://stackoverflow.com/questions/2269063/buffer-growth-strategy
      const newSize = oldBuffer.length + (oldBuffer.length >> 1) + size;
      this.buffer = new Uint8Array(newSize);
      copy(oldBuffer, this.buffer);
    }
  }

  addInt32(num: number) {
    this._ensure(4);
    this.buffer[this.offset++] = (num >>> 24) & 0xff;
    this.buffer[this.offset++] = (num >>> 16) & 0xff;
    this.buffer[this.offset++] = (num >>> 8) & 0xff;
    this.buffer[this.offset++] = (num >>> 0) & 0xff;
    return this;
  }

  addInt16(num: number) {
    this._ensure(2);
    this.buffer[this.offset++] = (num >>> 8) & 0xff;
    this.buffer[this.offset++] = (num >>> 0) & 0xff;
    return this;
  }

  addCString(string?: string) {
    // just write a 0 for empty or null strings
    if (!string) {
      this._ensure(1);
    } else {
      const encodedStr = this.encoder.encode(string);
      this._ensure(encodedStr.byteLength + 1); // +1 for null terminator
      copy(encodedStr, this.buffer, this.offset);
      this.offset += encodedStr.byteLength;
    }

    this.buffer[this.offset++] = 0; // null terminator
    return this;
  }

  addChar(c: string) {
    if (c.length != 1) {
      throw new Error("addChar requires single character strings");
    }

    this._ensure(1);
    copy(this.encoder.encode(c), this.buffer, this.offset);
    this.offset++;
    return this;
  }

  addString(string?: string) {
    string = string || "";
    const encodedStr = this.encoder.encode(string);
    this._ensure(encodedStr.byteLength);
    copy(encodedStr, this.buffer, this.offset);
    this.offset += encodedStr.byteLength;
    return this;
  }

  add(otherBuffer: Uint8Array) {
    this._ensure(otherBuffer.length);
    copy(otherBuffer, this.buffer, this.offset);
    this.offset += otherBuffer.length;
    return this;
  }

  clear() {
    this.offset = 5;
    this.headerPosition = 0;
  }

  // appends a header block to all the written data since the last
  // subsequent header or to the beginning if there is only one data block
  addHeader(code: number, last?: boolean) {
    const origOffset = this.offset;
    this.offset = this.headerPosition;
    this.buffer[this.offset++] = code;
    // length is everything in this packet minus the code
    this.addInt32(origOffset - (this.headerPosition + 1));
    // set next header position
    this.headerPosition = origOffset;
    // make space for next header
    this.offset = origOffset;
    if (!last) {
      this._ensure(5);
      this.offset += 5;
    }
    return this;
  }

  join(code?: number) {
    if (code) {
      this.addHeader(code, true);
    }
    return this.buffer.slice(code ? 0 : 5, this.offset);
  }

  flush(code?: number) {
    const result = this.join(code);
    this.clear();
    return result;
  }
}
