// Loaded from https://raw.githubusercontent.com/nats-io/nkeys.js/v1.0.0-9/src/codec.ts


/*
 * Copyright 2018-2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { crc16 } from "./crc16.ts";
import { NKeysError, NKeysErrorCode, Prefix, Prefixes } from "./nkeys.ts";
import { base32 } from "./base32.ts";

/**
 * @ignore
 */
export interface SeedDecode {
  prefix: Prefix;
  buf: Uint8Array;
}
/**
 * @ignore
 */
export class Codec {
  static encode(prefix: Prefix, src: Uint8Array): Uint8Array {
    if (!src || !(src instanceof Uint8Array)) {
      throw new NKeysError(NKeysErrorCode.SerializationError);
    }

    if (!Prefixes.isValidPrefix(prefix)) {
      throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
    }

    return Codec._encode(false, prefix, src);
  }

  static encodeSeed(role: Prefix, src: Uint8Array): Uint8Array {
    if (!src) {
      throw new NKeysError(NKeysErrorCode.ApiError);
    }

    if (!Prefixes.isValidPublicPrefix(role)) {
      throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
    }

    if (src.byteLength !== 32) {
      throw new NKeysError(NKeysErrorCode.InvalidSeedLen);
    }
    return Codec._encode(true, role, src);
  }

  static decode(expected: Prefix, src: Uint8Array): Uint8Array {
    if (!Prefixes.isValidPrefix(expected)) {
      throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
    }
    const raw = Codec._decode(src);
    if (raw[0] !== expected) {
      throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
    }
    return raw.slice(1);
  }

  static decodeSeed(src: Uint8Array): SeedDecode {
    const raw = Codec._decode(src);
    const prefix = Codec._decodePrefix(raw);
    if (prefix[0] != Prefix.Seed) {
      throw new NKeysError(NKeysErrorCode.InvalidSeed);
    }
    if (!Prefixes.isValidPublicPrefix(prefix[1])) {
      throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
    }
    return ({ buf: raw.slice(2), prefix: prefix[1] });
  }

  // unsafe encode no prefix/role validation
  static _encode(seed: boolean, role: Prefix, payload: Uint8Array): Uint8Array {
    // offsets for this token
    const payloadOffset = seed ? 2 : 1;
    const payloadLen = payload.byteLength;
    const checkLen = 2;
    const cap = payloadOffset + payloadLen + checkLen;
    const checkOffset = payloadOffset + payloadLen;

    const raw = new Uint8Array(cap);
    // make the prefixes human readable when encoded
    if (seed) {
      const encodedPrefix = Codec._encodePrefix(Prefix.Seed, role);
      raw.set(encodedPrefix);
    } else {
      raw[0] = role;
    }
    raw.set(payload, payloadOffset);

    //calculate the checksum write it LE
    const checksum = crc16.checksum(raw.slice(0, checkOffset));
    const dv = new DataView(raw.buffer);
    dv.setUint16(checkOffset, checksum, true);

    return base32.encode(raw);
  }

  // unsafe decode - no prefix/role validation
  static _decode(src: Uint8Array): Uint8Array {
    if (src.byteLength < 4) {
      throw new NKeysError(NKeysErrorCode.InvalidEncoding);
    }
    let raw: Uint8Array;
    try {
      raw = base32.decode(src);
    } catch (ex) {
      throw new NKeysError(NKeysErrorCode.InvalidEncoding, ex);
    }

    const checkOffset = raw.byteLength - 2;
    const dv = new DataView(raw.buffer);
    const checksum = dv.getUint16(checkOffset, true);

    const payload = raw.slice(0, checkOffset);
    if (!crc16.validate(payload, checksum)) {
      throw new NKeysError(NKeysErrorCode.InvalidChecksum);
    }
    return payload;
  }

  static _encodePrefix(kind: Prefix, role: Prefix): Uint8Array {
    // In order to make this human printable for both bytes, we need to do a little
    // bit manipulation to setup for base32 encoding which takes 5 bits at a time.
    const b1 = kind | (role >> 5);
    const b2 = (role & 31) << 3; // 31 = 00011111
    return new Uint8Array([b1, b2]);
  }

  static _decodePrefix(raw: Uint8Array): Uint8Array {
    // Need to do the reverse from the printable representation to
    // get back to internal representation.
    const b1 = raw[0] & 248; // 248 = 11111000
    const b2 = (raw[0] & 7) << 5 | ((raw[1] & 248) >> 3); // 7 = 00000111
    return new Uint8Array([b1, b2]);
  }
}
