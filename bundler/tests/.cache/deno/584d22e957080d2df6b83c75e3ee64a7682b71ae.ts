// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/rsa/export_key.ts


import type { RSAKeyParams } from "./common.ts";
import { bignum_to_byte } from "../helper.ts";
import { encode } from "./../../src/utility/encode.ts";

function ber_size_bytes(size: number): number[] {
  // The BER Length
  // The second component in the TLV structure of a BER element is the length.
  // This specifies the size in bytes of the encoded value. For the most part,
  // this uses a straightforward binary encoding of the integer value
  // (for example, if the encoded value is five bytes long, then it is encoded as
  // 00000101 binary, or 0x05 hex), but if the value is longer than 127 bytes then
  // it is necessary to use multiple bytes to encode the length. In that case, the
  // first byte has the leftmost bit set to one and the remaining seven bits are
  // used to specify the number of bytes required to encode the full length. For example,
  // if there are 500 bytes in the length (hex 0x01F4), then the encoded length will actually
  // consist of three bytes: 82 01 F4.
  //
  // Note that there is an alternate form for encoding the length called the indefinite form.
  // In this mechanism, only a part of the length is given at a time, similar to the chunked encoding
  // that is available in HTTP 1.1. However, this form is not used in LDAP, as specified in RFC 2251
  // section 5.1.
  // https://docs.oracle.com/cd/E19476-01/821-0510/def-basic-encoding-rules.html

  if (size <= 127) return [size];

  const bytes = [];
  while (size > 0) {
    bytes.push(size & 0xff);
    size = size >> 8;
  }

  bytes.reverse();
  return [0x80 + bytes.length, ...bytes];
}

function add_line_break(base64_str: string): string {
  const lines = [];
  for (let i = 0; i < base64_str.length; i += 64) {
    lines.push(base64_str.substr(i, 64));
  }

  return lines.join("\n");
}

function ber_generate_integer_list(order: number[][]) {
  let content: number[] = [];

  for (const item of order) {
    if ((item[0] & 0x80) > 0) {
      content = content.concat(
        [0x02, ...ber_size_bytes(item.length + 1), 0x0, ...item],
      );
    } else {
      content = content.concat(
        [0x02, ...ber_size_bytes(item.length), ...item],
      );
    }
  }

  return content;
}

export function rsa_export_pkcs8_public(key: RSAKeyParams) {
  const n = bignum_to_byte(key.n);
  const e = bignum_to_byte(key.e || 0n);

  // deno-fmt-ignore
  const other = [0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00];

  // Key sequence
  const content = ber_generate_integer_list([n, e]);
  const keySequence = [
    0x30,
    ...ber_size_bytes(content.length),
    ...content,
  ];

  // Bitstring
  const bitString = [
    0x03,
    ...ber_size_bytes(keySequence.length + 1),
    0x00,
    ...keySequence,
  ];

  const ber = [
    0x30,
    ...ber_size_bytes(other.length + bitString.length),
    ...other,
    ...bitString,
  ];

  return "-----BEGIN PUBLIC KEY-----\n" +
    add_line_break(encode.binary(ber).base64()) +
    "\n-----END PUBLIC KEY-----\n";
}

export function rsa_export_pkcs8_private(key: RSAKeyParams) {
  const n = bignum_to_byte(key.n);
  const e = bignum_to_byte(key.e || 0n);
  const d = bignum_to_byte(key.d || 0n);
  const q = bignum_to_byte(key.q || 0n);
  const p = bignum_to_byte(key.p || 0n);
  const dp = bignum_to_byte(key.dp || 0n);
  const dq = bignum_to_byte(key.dq || 0n);
  const qi = bignum_to_byte(key.qi || 0n);

  const content = ber_generate_integer_list([n, e, d, p, q, dp, dq, qi]);

  const ber = encode.binary([
    0x30,
    ...ber_size_bytes(content.length + 3),
    0x02,
    0x01,
    0x00,
    ...content,
  ]).base64();

  return "-----BEGIN RSA PRIVATE KEY-----\n" + add_line_break(ber) +
    "\n-----END RSA PRIVATE KEY-----\n";
}
