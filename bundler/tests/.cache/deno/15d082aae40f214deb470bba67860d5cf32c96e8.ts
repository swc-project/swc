// Loaded from https://deno.land/x/cliffy@v0.18.0/ansi/chain.ts


/** Chainable ansi escape sequence's. */
import type { ImageOptions } from "./ansi_escapes.ts";

/** Chainable ansi escape method declarations. */
export interface Chain<T extends Chain<T>> {
  /** Add text. */
  text: (text: string) => T;
  /** Ring audio bell: `\u0007` */
  bel: T;
  /** Get cursor position. */
  cursorPosition: T;
  /**
   * Move cursor to x, y, counting from the top left corner.
   * @param x Position left.
   * @param y Position top.
   */
  cursorTo: (x: number, y?: number) => T;
  /**
   * Move cursor by offset.
   * @param x Offset left.
   * @param y Offset top.
   */
  cursorMove: (x: number, y: number) => T;
  /**
   * Move cursor up by n lines.
   * @param count Number of lines.
   */
  cursorUp: T & ((count: number) => T);
  /**
   * Move cursor down by n lines.
   * @param count Number of lines.
   */
  cursorDown: T & ((count: number) => T);
  /**
   * Move cursor forward by n lines.
   * @param count Number of lines.
   */
  cursorForward: T & ((count: number) => T);
  /**
   * Move cursor backward by n lines.
   * @param count Number of lines.
   */
  cursorBackward: T & ((count: number) => T);
  /**
   * Move cursor to the beginning of the line n lines down.
   * @param count Number of lines.
   */
  cursorNextLine: T & ((count: number) => T);
  /**
   * Move cursor to the beginning of the line n lines up.
   * @param count Number of lines.
   */
  cursorPrevLine: T & ((count: number) => T);
  /** Move cursor to first column of current row. */
  cursorLeft: T;
  /** Hide cursor. */
  cursorHide: T;
  /** Show cursor. */
  cursorShow: T;
  /** Save cursor. */
  cursorSave: T;
  /** Restore cursor. */
  cursorRestore: T;
  /**
   * Scroll window up by n lines.
   * @param count Number of lines.
   */
  scrollUp: T & ((count: number) => T);
  /**
   * Scroll window down by n lines.
   * @param count Number of lines.
   */
  scrollDown: T & ((count: number) => T);
  /** Clear screen. */
  eraseScreen: T;
  /**
   * Clear screen up by n lines.
   * @param count Number of lines.
   */
  eraseUp: T & ((count: number) => T);
  /**
   * Clear screen down by n lines.
   * @param count Number of lines.
   */
  eraseDown: T & ((count: number) => T);
  /** Clear current line. */
  eraseLine: T;
  /** Clear to line end. */
  eraseLineEnd: T;
  /** Clear to line start. */
  eraseLineStart: T;
  /**
   * Clear screen and move cursor by n lines up and move cursor to first column.
   * @param count Number of lines.
   */
  eraseLines: (count: number) => T;
  /** Clear the terminal screen. (Viewport) */
  clearScreen: T;
  /**
   * Clear the whole terminal, including scrollback buffer.
   * (Not just the visible part of it).
   */
  clearTerminal: T;
  /**
   * Create link.
   * @param text Link text.
   * @param url Link url.
   * ```
   * console.log(
   *   ansi.link("Click me.", "https://deno.land"),
   * );
   * ```
   */
  link: (text: string, url: string) => T;
  /**
   * Create image.
   * @param buffer  Image buffer.
   * @param options Image options.
   * ```
   * const response = await fetch("https://deno.land/images/hashrock_simple.png");
   * const imageBuffer: ArrayBuffer = await response.arrayBuffer();
   * console.log(
   *   ansi.image(imageBuffer),
   * );
   * ```
   */
  image: (buffer: string | ArrayBuffer, options?: ImageOptions) => T;
}
