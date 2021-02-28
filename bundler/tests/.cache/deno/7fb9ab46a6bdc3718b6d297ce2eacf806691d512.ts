// Loaded from https://deno.land/x/dnit@dnit-v1.11.0/textTable.ts


export function textTable(headings: string[], cells: string[][]): string {
  const corners = [["┌", "┐"], ["└", "┘"]];
  const hbar = "─";
  const vbar = "│";
  const ttop = "┬";
  const tbottom = "┴";
  const cross = "┼";
  const tleft = "├";
  const tright = "┤";
  const maxWidths: number[] = headings.map((t) => t.length);
  for (const row of cells) {
    let colInd = 0;
    for (const col of row) {
      maxWidths[colInd] = Math.max(maxWidths[colInd], col.length);
      ++colInd;
    }
  }
  const output: string[] = [];
  // corner & top bars
  {
    const textrow: string[] = [];
    textrow.push(corners[0][0]);
    textrow.push(maxWidths.map((n) => hbar.repeat(n + 2)).join(ttop));
    textrow.push(corners[0][1]);
    output.push(textrow.join(""));
  }
  // mid
  {
    const textrow: string[] = [];
    textrow.push(vbar);
    textrow.push(
      headings.map((h, i) => {
        const curLength = h.length;
        const maxWidth = maxWidths[i];
        const curSpaces = (maxWidth - curLength);
        const spaceBefore = Math.floor(curSpaces / 2);
        const spaceAfter = curSpaces - spaceBefore;
        return " ".repeat(1 + spaceBefore) + h + " ".repeat(1 + spaceAfter);
      }).join(vbar),
    );
    textrow.push(vbar);
    output.push(textrow.join(""));
  }
  // cross bar
  {
    const textrow: string[] = [];
    textrow.push(tleft);
    textrow.push(maxWidths.map((n) => hbar.repeat(n + 2)).join(cross));
    textrow.push(tright);
    output.push(textrow.join(""));
  }
  // cells
  for (const row of cells) {
    const textrow: string[] = [];
    textrow.push(vbar);
    textrow.push(
      row.map((t, i) => {
        const curLength = t.length;
        const maxWidth = maxWidths[i];
        const curSpaces = (maxWidth - curLength);
        const spaceBefore = Math.floor(curSpaces / 2);
        const spaceAfter = curSpaces - spaceBefore;
        return " ".repeat(1 + spaceBefore) + t + " ".repeat(1 + spaceAfter);
      }).join(vbar),
    );
    textrow.push(vbar);
    output.push(textrow.join(""));
  }
  // corner & bottom bars
  {
    const textrow: string[] = [];
    textrow.push(corners[1][0]);
    textrow.push(maxWidths.map((n) => hbar.repeat(n + 2)).join(tbottom));
    textrow.push(corners[1][1]);
    output.push(textrow.join(""));
  }
  return output.join("\n");
}
