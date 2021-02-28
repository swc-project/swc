// Loaded from https://deno.land/x/deno_image@v0.0.3/lib/decoders/fast-png/common.ts


export const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];

const crcTable: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

const initialCrc = 0xffffffff;
function updateCrc(
  currentCrc: number,
  data: Uint8Array,
  length: number,
): number {
  let c = currentCrc;
  for (let n = 0; n < length; n++) {
    c = crcTable[(c ^ data[n]) & 0xff] ^ (c >>> 8);
  }
  return c;
}

export function crc(data: Uint8Array, length: number): number {
  return (updateCrc(initialCrc, data, length) ^ initialCrc) >>> 0;
}
