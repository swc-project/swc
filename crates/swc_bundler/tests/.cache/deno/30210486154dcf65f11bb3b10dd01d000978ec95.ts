// Loaded from https://deno.land/x/cliffy@v0.18.0/ansi/ansi_escapes.ts


import { encodeBase64 } from "./deps.ts";

/** Escape sequence: `\x1B` */
const ESC = "\x1B";
/** Control sequence intro: `\x1B[` */
const CSI = `${ESC}[`;
/** Operating system command: `\x1B]` */
const OSC = `${ESC}]`;
/** Link separator */
const SEP = ";";

/** Ring audio bell: `\u0007` */
export const bel = "\u0007";
/** Get cursor position. */
export const cursorPosition = `${CSI}6n`;

/**
 * Move cursor to x, y, counting from the top left corner.
 * @param x Position left.
 * @param y Position top.
 */
export function cursorTo(x: number, y?: number): string {
  if (typeof y !== "number") {
    return `${CSI}${x}G`;
  }
  return `${CSI}${y};${x}H`;
}

/**
 * Move cursor by offset.
 * @param x Offset left.
 * @param y Offset top.
 */
export function cursorMove(x: number, y: number): string {
  let ret = "";

  if (x < 0) {
    ret += `${CSI}${-x}D`;
  } else if (x > 0) {
    ret += `${CSI}${x}C`;
  }

  if (y < 0) {
    ret += `${CSI}${-y}A`;
  } else if (y > 0) {
    ret += `${CSI}${y}B`;
  }

  return ret;
}

/**
 * Move cursor up by n lines.
 * @param count Number of lines.
 */
export function cursorUp(count = 1): string {
  return `${CSI}${count}A`;
}

/**
 * Move cursor down by n lines.
 * @param count Number of lines.
 */
export function cursorDown(count = 1): string {
  return `${CSI}${count}B`;
}

/**
 * Move cursor forward by n lines.
 * @param count Number of lines.
 */
export function cursorForward(count = 1): string {
  return `${CSI}${count}C`;
}

/**
 * Move cursor backward by n lines.
 * @param count Number of lines.
 */
export function cursorBackward(count = 1): string {
  return `${CSI}${count}D`;
}

/**
 * Move cursor to the beginning of the line n lines down.
 * @param count Number of lines.
 */
export function cursorNextLine(count = 1): string {
  return `${CSI}E`.repeat(count);
}

/**
 * Move cursor to the beginning of the line n lines up.
 * @param count Number of lines.
 */
export function cursorPrevLine(count = 1): string {
  return `${CSI}F`.repeat(count);
}

/** Move cursor to first column of current row. */
export const cursorLeft = `${CSI}G`;
/** Hide cursor. */
export const cursorHide = `${CSI}?25l`;
/** Show cursor. */
export const cursorShow = `${CSI}?25h`;
/** Save cursor. */
export const cursorSave = `${ESC}7`;
/** Restore cursor. */
export const cursorRestore = `${ESC}8`;

/**
 * Scroll window up by n lines.
 * @param count Number of lines.
 */
export function scrollUp(count = 1): string {
  return `${CSI}S`.repeat(count);
}

/**
 * Scroll window down by n lines.
 * @param count Number of lines.
 */
export function scrollDown(count = 1): string {
  return `${CSI}T`.repeat(count);
}

/** Clear screen. */
export const eraseScreen = `${CSI}2J`;

/**
 * Clear screen up by n lines.
 * @param count Number of lines.
 */
export function eraseUp(count = 1): string {
  return `${CSI}1J`.repeat(count);
}

/**
 * Clear screen down by n lines.
 * @param count Number of lines.
 */
export function eraseDown(count = 1): string {
  return `${CSI}0J`.repeat(count);
}

/** Clear current line. */
export const eraseLine = `${CSI}2K`;
/** Clear to line end. */
export const eraseLineEnd = `${CSI}0K`;
/** Clear to line start. */
export const eraseLineStart = `${CSI}1K`;

/**
 * Clear screen and move cursor by n lines up and move cursor to first column.
 * @param count Number of lines.
 */
export function eraseLines(count: number): string {
  let clear = "";
  for (let i = 0; i < count; i++) {
    clear += eraseLine + (i < count - 1 ? cursorUp() : "");
  }
  clear += cursorLeft;
  return clear;
}

/** Clear the terminal screen. (Viewport) */
export const clearScreen = "\u001Bc";

/**
 * Clear the whole terminal, including scrollback buffer.
 * (Not just the visible part of it).
 */
export const clearTerminal = Deno.build.os === "windows"
  ? `${eraseScreen}${CSI}0f`
  : // 1. Erases the screen (Only done in case `2` is not supported)
  // 2. Erases the whole screen including scrollback buffer
  // 3. Moves cursor to the top-left position
  // More info: https://www.real-world-systems.com/docs/ANSIcode.html
    `${eraseScreen}${CSI}3J${CSI}H`;

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
export function link(text: string, url: string): string {
  return [
    OSC,
    "8",
    SEP,
    SEP,
    url,
    bel,
    text,
    OSC,
    "8",
    SEP,
    SEP,
    bel,
  ].join("");
}

/** Image options. */
export interface ImageOptions {
  width?: number;
  height?: number;
  preserveAspectRatio?: boolean;
}

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
export function image(
  buffer: string | ArrayBuffer,
  options?: ImageOptions,
): string {
  let ret = `${OSC}1337;File=inline=1`;

  if (options?.width) {
    ret += `;width=${options.width}`;
  }

  if (options?.height) {
    ret += `;height=${options.height}`;
  }

  if (options?.preserveAspectRatio === false) {
    ret += ";preserveAspectRatio=0";
  }

  return ret + ":" + encodeBase64(buffer) + bel;
}
