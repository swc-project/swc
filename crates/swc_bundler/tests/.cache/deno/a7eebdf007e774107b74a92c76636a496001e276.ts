// Loaded from https://deno.land/std@0.92.0/io/util.ts


import { Buffer } from "./buffer.ts";

/** Read Reader `r` until EOF (`null`) and resolve to the content as
 * Uint8Array`.
 *
 * ```ts
 * 
 * // Example from stdin
 * const stdinContent = await readAll(Deno.stdin);
 *
 * // Example from file
 * const file = await Deno.open("my_file.txt", {read: true});
 * const myFileContent = await readAll(file);
 * Deno.close(file.rid);
 *
 * // Example from buffer
 * const myData = new Uint8Array(100);
 * // ... fill myData array with data
 * const reader = new Buffer(myData.buffer as ArrayBuffer);
 * const bufferContent = await readAll(reader);
 * ```
 */
export async function readAll(r: Deno.Reader): Promise<Uint8Array> {
  const buf = new Buffer();
  await buf.readFrom(r);
  return buf.bytes();
}

/** Synchronously reads Reader `r` until EOF (`null`) and returns the content
 * as `Uint8Array`.
 *
 * ```ts
 * // Example from stdin
 * const stdinContent = readAllSync(Deno.stdin);
 *
 * // Example from file
 * const file = Deno.openSync("my_file.txt", {read: true});
 * const myFileContent = readAllSync(file);
 * Deno.close(file.rid);
 *
 * // Example from buffer
 * const myData = new Uint8Array(100);
 * // ... fill myData array with data
 * const reader = new Buffer(myData.buffer as ArrayBuffer);
 * const bufferContent = readAllSync(reader);
 * ```
 */
export function readAllSync(r: Deno.ReaderSync): Uint8Array {
  const buf = new Buffer();
  buf.readFromSync(r);
  return buf.bytes();
}

/** Write all the content of the array buffer (`arr`) to the writer (`w`).
 *
 * ```ts
 * // Example writing to stdout
 * const contentBytes = new TextEncoder().encode("Hello World");
 * await writeAll(Deno.stdout, contentBytes);
 *
 * // Example writing to file
 * const contentBytes = new TextEncoder().encode("Hello World");
 * const file = await Deno.open('test.file', {write: true});
 * await writeAll(file, contentBytes);
 * Deno.close(file.rid);
 *
 * // Example writing to buffer
 * const contentBytes = new TextEncoder().encode("Hello World");
 * const writer = new Buffer();
 * await writeAll(writer, contentBytes);
 * console.log(writer.bytes().length);  // 11
 * ```
 */
export async function writeAll(w: Deno.Writer, arr: Uint8Array): Promise<void> {
  let nwritten = 0;
  while (nwritten < arr.length) {
    nwritten += await w.write(arr.subarray(nwritten));
  }
}

/** Synchronously write all the content of the array buffer (`arr`) to the
 * writer (`w`).
 *
 * ```ts
 * // Example writing to stdout
 * const contentBytes = new TextEncoder().encode("Hello World");
 * writeAllSync(Deno.stdout, contentBytes);
 *
 * // Example writing to file
 * const contentBytes = new TextEncoder().encode("Hello World");
 * const file = Deno.openSync('test.file', {write: true});
 * writeAllSync(file, contentBytes);
 * Deno.close(file.rid);
 *
 * // Example writing to buffer
 * const contentBytes = new TextEncoder().encode("Hello World");
 * const writer = new Buffer();
 * writeAllSync(writer, contentBytes);
 * console.log(writer.bytes().length);  // 11
 * ```
 */
export function writeAllSync(w: Deno.WriterSync, arr: Uint8Array): void {
  let nwritten = 0;
  while (nwritten < arr.length) {
    nwritten += w.writeSync(arr.subarray(nwritten));
  }
}
