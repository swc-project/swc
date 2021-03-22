// Loaded from https://deno.land/x/cliffy@v0.18.0/table/utils.ts


/**
 * Get next words from the beginning of [content] until all words have a length lower or equal then [length].
 *
 * @param length    Max length of all words.
 * @param content   The text content.
 */
import { Cell, ICell } from "./cell.ts";
import { stripColor } from "./deps.ts";

export function consumeWords(length: number, content: string): string {
  let consumed = "";
  const words: string[] = content.split(/ /g);

  for (let i = 0; i < words.length; i++) {
    let word: string = words[i];
    const hasLineBreak = word.indexOf("\n") !== -1;

    if (hasLineBreak) {
      word = word.split("\n").shift() as string;
    }

    // consume minimum one word
    if (consumed) {
      const nextLength = stripColor(word).length;
      const consumedLength = stripColor(consumed).length;
      if (consumedLength + nextLength >= length) {
        break;
      }
    }

    consumed += (i > 0 ? " " : "") + word;

    if (hasLineBreak) {
      break;
    }
  }

  return consumed;
}

/**
 * Get longest cell from given row index.
 *
 */
export function longest(
  index: number,
  rows: ICell[][],
  maxWidth?: number,
): number {
  return Math.max(
    ...rows.map((row) =>
      (
        row[index] instanceof Cell && (row[index] as Cell).getColSpan() > 1
          ? ""
          : (row[index]?.toString() || "")
      )
        .split("\n")
        .map((r: string) => {
          const str = typeof maxWidth === "undefined"
            ? r
            : consumeWords(maxWidth, r);
          return stripColor(str).length || 0;
        })
    ).flat(),
  );
}
