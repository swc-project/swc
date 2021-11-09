// Loaded from https://deno.land/x/bytes_formater/format.ts


import { green } from "./deps.ts";

export function format(data: ArrayBufferView) {
  const bytes = new Uint8Array(data.buffer);
  let out = "         +-------------------------------------------------+\n";
  out += `         |${
    green("  0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f ")
  }|\n`;
  out +=
    "+--------+-------------------------------------------------+----------------+\n";

  const lineCount = Math.ceil(bytes.length / 16);

  for (let line = 0; line < lineCount; line++) {
    const start = line * 16;
    const addr = start.toString(16).padStart(8, "0");
    const lineBytes = bytes.slice(start, start + 16);

    out += `|${green(addr)}| `;

    lineBytes.forEach(
      (byte) => (out += byte.toString(16).padStart(2, "0") + " "),
    );

    if (lineBytes.length < 16) {
      out += "   ".repeat(16 - lineBytes.length);
    }

    out += "|";

    lineBytes.forEach(function (byte) {
      return (out += byte > 31 && byte < 127
        ? green(String.fromCharCode(byte))
        : ".");
    });

    if (lineBytes.length < 16) {
      out += " ".repeat(16 - lineBytes.length);
    }

    out += "|\n";
  }
  out +=
    "+--------+-------------------------------------------------+----------------+";
  return out;
}
