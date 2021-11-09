// Loaded from https://deno.land/x/cliffy@v0.18.0/ansi/cursor_position.ts


import { cursorPosition } from "./ansi_escapes.ts";

/** Cursor position. */
export interface Cursor {
  x: number;
  y: number;
}

/** Cursor position options. */
export interface CursorPositionOptions {
  stdout?: Deno.WriterSync;
  stdin?: Deno.ReaderSync & { rid: number };
}

/**
 * Get cursor position.
 * @param options  Options.
 * ```
 * const cursor: Cursor = getCursorPosition();
 * console.log(cursor); // { x: 0, y: 14}
 * ```
 */
export function getCursorPosition(options: CursorPositionOptions): Cursor {
  const stdout: Deno.WriterSync = options?.stdout ?? Deno.stdout;
  const stdin: Deno.ReaderSync & { rid: number } = options?.stdin ?? Deno.stdin;
  const data = new Uint8Array(8);

  Deno.setRaw(stdin.rid, true);
  stdout.writeSync(new TextEncoder().encode(cursorPosition));
  stdin.readSync(data);
  Deno.setRaw(stdin.rid, false);

  const [y, x] = new TextDecoder()
    .decode(data)
    .match(/\[(\d+);(\d+)R/)
    ?.slice(1, 3)
    .map(Number) ?? [0, 0];

  return { x, y };
}
