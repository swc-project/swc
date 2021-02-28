// Loaded from https://deno.land/x/sqlite@v2.3.1/src/wasm.ts


import SqliteError from "./error.ts";

// Move string to C
export function setStr(
  wasm: any,
  str: string,
  closure: (ptr: number) => void,
) {
  const bytes = new TextEncoder().encode(str);
  const ptr = wasm.malloc(bytes.length + 1);
  if (ptr === 0) {
    throw new SqliteError("Out of memory.");
  }
  const mem = new Uint8Array(wasm.memory.buffer, ptr, bytes.length + 1);
  mem.set(bytes);
  mem[bytes.length] = 0; // \0 terminator
  closure(ptr);
  wasm.free(ptr);
}

// Move Uint8Array to C
export function setArr(
  wasm: any,
  arr: Uint8Array,
  closure: (ptr: number) => void,
) {
  const ptr = wasm.malloc(arr.length);
  if (ptr === 0) {
    throw new SqliteError("Out of memory.");
  }
  const mem = new Uint8Array(wasm.memory.buffer, ptr, arr.length);
  mem.set(arr);
  closure(ptr);
  wasm.free(ptr);
}

// Read string from C
export function getStr(wasm: any, ptr: number): string {
  const len = wasm.str_len(ptr);
  const bytes = new Uint8Array(wasm.memory.buffer, ptr, len);
  if (len > 16) {
    return new TextDecoder().decode(bytes);
  } else {
    // This optimization is lifted from EMSCRIPTEN's glue code
    let str = "";
    let idx = 0;
    while (idx < len) {
      var u0 = bytes[idx++];
      if (!(u0 & 0x80)) {
        str += String.fromCharCode(u0);
        continue;
      }
      var u1 = bytes[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1);
        continue;
      }
      var u2 = bytes[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        // cut warning
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (bytes[idx++] & 63);
      }
      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
    return str;
  }
}
