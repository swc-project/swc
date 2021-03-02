// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/rsa/basic_encoding_rule.ts


interface BasicEncodingRule {
  type: number;
  length: number;
  totalLength: number;
  value: BasicEncodingRuleValue;
}

type BasicEncodingRuleValue =
  | Uint8Array
  | string
  | number
  | BasicEncodingRule[]
  | null
  | bigint;
type BasicEncodingSimpleValue =
  | Uint8Array
  | string
  | number
  | null
  | bigint
  | BasicEncodingSimpleValue[];

export function ber_decode(
  bytes: Uint8Array,
  from?: number,
  to?: number,
): BasicEncodingRule {
  return ber_next(bytes);
}

function ber_sequence(
  bytes: Uint8Array,
  from: number,
  length: number,
): BasicEncodingRule[] {
  const end = from + length;
  let res: BasicEncodingRule[] = [];
  let ptr = from;

  while (ptr < end) {
    const next = ber_next(bytes, ptr);
    res.push(next);
    ptr += next.totalLength;
  }

  return res;
}

function ber_integer(bytes: Uint8Array, from: number, length: number): bigint {
  let n = 0n;
  for (const b of bytes.slice(from, from + length)) {
    n = (n << 8n) + BigInt(b);
  }
  return n;
}

function ber_oid(bytes: Uint8Array, from: number, length: number): string {
  const id = [
    (bytes[from] / 40) | 0,
    (bytes[from] % 40),
  ];
  let value = 0;

  for (const b of bytes.slice(from + 1, from + length)) {
    if (b > 128) value += value * 127 + (b - 128);
    else {
      value = value * 128 + b;
      id.push(value);
      value = 0;
    }
  }

  return id.join(".");
}

function ber_unknown(
  bytes: Uint8Array,
  from: number,
  length: number,
): Uint8Array {
  return bytes.slice(from, from + length);
}

export function ber_simple(n: BasicEncodingRule): BasicEncodingSimpleValue {
  if (Array.isArray(n.value)) return n.value.map((x) => ber_simple(x));
  return n.value as BasicEncodingSimpleValue;
}

function ber_next(
  bytes: Uint8Array,
  from?: number,
  to?: number,
): BasicEncodingRule {
  if (!from) from = 0;
  if (!to) to = bytes.length;

  let ptr = from;

  const type = bytes[ptr++];
  let size = bytes[ptr++];

  if ((size & 0x80) > 0) {
    let ext = size - 0x80;
    size = 0;

    while (--ext >= 0) {
      size = (size << 8) + bytes[ptr++];
    }
  }

  // Sequence
  let value = null;
  if (type === 0x30) {
    value = ber_sequence(bytes, ptr, size);
  } else if (type === 0x2) {
    value = ber_integer(bytes, ptr, size);
  } else if (type === 0x3) {
    value = ber_sequence(bytes, ptr + 1, size - 1);
  } else if (type === 0x5) {
    value = null;
  } else if (type === 0x6) {
    value = ber_oid(bytes, ptr, size);
  } else {
    value = ber_unknown(bytes, ptr, size);
  }

  return {
    totalLength: (ptr - from) + size,
    type,
    length: size,
    value,
  };
}
