// Loaded from https://deno.land/x/cliffy@v0.18.0/table/layout.ts


import { Cell, ICell } from "./cell.ts";
import { stripColor } from "./deps.ts";
import { IRow, Row } from "./row.ts";
import type { IBorderOptions, ITableSettings, Table } from "./table.ts";
import { consumeWords, longest } from "./utils.ts";

/** Layout render settings. */
interface IRenderSettings {
  padding: number[];
  width: number[];
  columns: number;
  hasBorder: boolean;
  hasHeaderBorder: boolean;
  hasBodyBorder: boolean;
  rows: Row<Cell>[];
}

/** Table layout renderer. */
export class TableLayout {
  /**
   * Table layout constructor.
   * @param table   Table instance.
   * @param options Render options.
   */
  public constructor(
    private table: Table,
    private options: ITableSettings,
  ) {}

  /** Generate table string. */
  public toString(): string {
    const opts: IRenderSettings = this.createLayout();
    return opts.rows.length ? this.renderRows(opts) : "";
  }

  /**
   * Generates table layout including row and col span, converts all none
   * Cell/Row values to Cell's and Row's and returns the layout rendering
   * settings.
   */
  protected createLayout(): IRenderSettings {
    Object.keys(this.options.chars).forEach((key: string) => {
      if (typeof this.options.chars[key as keyof IBorderOptions] !== "string") {
        this.options.chars[key as keyof IBorderOptions] = "";
      }
    });

    const hasBodyBorder: boolean = this.table.getBorder() ||
      this.table.hasBodyBorder();
    const hasHeaderBorder: boolean = this.table.hasHeaderBorder();
    const hasBorder: boolean = hasHeaderBorder || hasBodyBorder;

    const header: Row | undefined = this.table.getHeader();
    const rows: Row<Cell>[] = this.spanRows(
      header ? [header, ...this.table] : this.table.slice(),
    );
    const columns: number = Math.max(...rows.map((row) => row.length));
    for (const row of rows) {
      const length: number = row.length;
      if (length < columns) {
        const diff = columns - length;
        for (let i = 0; i < diff; i++) {
          row.push(this.createCell(null, row));
        }
      }
    }

    const padding: number[] = [];
    const width: number[] = [];
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      const minColWidth: number = Array.isArray(this.options.minColWidth)
        ? this.options.minColWidth[colIndex]
        : this.options.minColWidth;
      const maxColWidth: number = Array.isArray(this.options.maxColWidth)
        ? this.options.maxColWidth[colIndex]
        : this.options.maxColWidth;
      const colWidth: number = longest(colIndex, rows, maxColWidth);
      width[colIndex] = Math.min(maxColWidth, Math.max(minColWidth, colWidth));
      padding[colIndex] = Array.isArray(this.options.padding)
        ? this.options.padding[colIndex]
        : this.options.padding;
    }

    return {
      padding,
      width,
      rows,
      columns,
      hasBorder,
      hasBodyBorder,
      hasHeaderBorder,
    };
  }

  /**
   * Fills rows and cols by specified row/col span with a reference of the
   * original cell.
   *
   * @param _rows     All table rows.
   * @param rowIndex  Current row index.
   * @param colIndex  Current col index.
   * @param rowSpan   Current row span.
   * @param colSpan   Current col span.
   */
  protected spanRows(
    _rows: IRow[],
    rowIndex = 0,
    colIndex = 0,
    rowSpan: number[] = [],
    colSpan = 1,
  ): Row<Cell>[] {
    const rows: Row<Cell>[] = _rows as Row<Cell>[];

    if (rowIndex >= rows.length && rowSpan.every((span) => span === 1)) {
      return rows;
    } else if (
      rows[rowIndex] && colIndex >= rows[rowIndex].length &&
      colIndex >= rowSpan.length && colSpan === 1
    ) {
      return this.spanRows(rows, ++rowIndex, 0, rowSpan, 1);
    }

    if (colSpan > 1) {
      colSpan--;
      rowSpan[colIndex] = rowSpan[colIndex - 1];
      rows[rowIndex].splice(colIndex - 1, 0, rows[rowIndex][colIndex - 1]);
      return this.spanRows(rows, rowIndex, ++colIndex, rowSpan, colSpan);
    }

    if (colIndex === 0) {
      rows[rowIndex] = this.createRow(rows[rowIndex] || []);
    }

    if (rowSpan[colIndex] > 1) {
      rowSpan[colIndex]--;
      rows[rowIndex].splice(colIndex, 0, rows[rowIndex - 1][colIndex]);
      return this.spanRows(rows, rowIndex, ++colIndex, rowSpan, colSpan);
    }

    rows[rowIndex][colIndex] = this.createCell(
      rows[rowIndex][colIndex] || null,
      rows[rowIndex],
    );

    colSpan = rows[rowIndex][colIndex].getColSpan();
    rowSpan[colIndex] = rows[rowIndex][colIndex].getRowSpan();

    return this.spanRows(rows, rowIndex, ++colIndex, rowSpan, colSpan);
  }

  /**
   * Create a new row from existing row or cell array.
   * @param row Original row.
   */
  protected createRow(row: IRow): Row<Cell> {
    return Row.from(row).border(this.table.getBorder(), false) as Row<Cell>;
  }

  /**
   * Create a new cell from existing cell or cell value.
   * @param cell  Original cell.
   * @param row   Parent row.
   */
  protected createCell(cell: ICell | null, row: Row): Cell {
    return Cell.from(cell ?? "").border(row.getBorder(), false);
  }

  /**
   * Render table layout.
   * @param opts Render options.
   */
  protected renderRows(opts: IRenderSettings): string {
    let result = "";
    const rowSpan: number[] = new Array(opts.columns).fill(1);

    for (let rowIndex = 0; rowIndex < opts.rows.length; rowIndex++) {
      result += this.renderRow(rowSpan, rowIndex, opts);
    }

    return result.slice(0, -1);
  }

  /**
   * Render row.
   * @param rowSpan     Current row span.
   * @param rowIndex    Current row index.
   * @param opts        Render options.
   * @param isMultiline Is multiline row.
   */
  protected renderRow(
    rowSpan: number[],
    rowIndex: number,
    opts: IRenderSettings,
    isMultiline?: boolean,
  ): string {
    const row: Row<Cell> = opts.rows[rowIndex];
    const prevRow: Row<Cell> | undefined = opts.rows[rowIndex - 1];
    const nextRow: Row<Cell> | undefined = opts.rows[rowIndex + 1];
    let result = "";

    let colSpan = 1;

    // border top row
    if (!isMultiline && rowIndex === 0 && row.hasBorder()) {
      result += this.renderBorderRow(undefined, row, rowSpan, opts);
    }

    let isMultilineRow = false;

    result += " ".repeat(this.options.indent || 0);

    for (let colIndex = 0; colIndex < opts.columns; colIndex++) {
      if (colSpan > 1) {
        colSpan--;
        rowSpan[colIndex] = rowSpan[colIndex - 1];
        continue;
      }

      result += this.renderCell(colIndex, row, prevRow, rowSpan, opts);

      if (rowSpan[colIndex] > 1) {
        if (!isMultiline) {
          rowSpan[colIndex]--;
        }
      } else if (!prevRow || prevRow[colIndex] !== row[colIndex]) {
        rowSpan[colIndex] = row[colIndex].getRowSpan();
      }

      colSpan = row[colIndex].getColSpan();

      if (rowSpan[colIndex] === 1 && row[colIndex].length) {
        isMultilineRow = true;
      }
    }

    if (opts.columns > 0) {
      if (row[opts.columns - 1].getBorder()) {
        result += this.options.chars.right;
      } else if (opts.hasBorder) {
        result += " ";
      }
    }

    result += "\n";

    if (isMultilineRow) { // skip border
      return result + this.renderRow(rowSpan, rowIndex, opts, isMultilineRow);
    }

    // border mid row
    if (
      (rowIndex === 0 && opts.hasHeaderBorder) ||
      (rowIndex < opts.rows.length - 1 && opts.hasBodyBorder)
    ) {
      result += this.renderBorderRow(row, nextRow, rowSpan, opts);
    }

    // border bottom row
    if (rowIndex === opts.rows.length - 1 && row.hasBorder()) {
      result += this.renderBorderRow(row, undefined, rowSpan, opts);
    }

    return result;
  }

  /**
   * Render cell.
   * @param colIndex  Current col index.
   * @param row       Current row.
   * @param prevRow   Previous row.
   * @param rowSpan   Current row span.
   * @param opts      Render options.
   * @param noBorder  Disable border.
   */
  protected renderCell(
    colIndex: number,
    row: Row<Cell>,
    prevRow: Row<Cell> | undefined,
    rowSpan: number[],
    opts: IRenderSettings,
    noBorder?: boolean,
  ): string {
    let result = "";
    const prevCell: Cell | undefined = row[colIndex - 1];

    const cell: Cell = row[colIndex];

    if (!noBorder) {
      if (colIndex === 0) {
        if (cell.getBorder()) {
          result += this.options.chars.left;
        } else if (opts.hasBorder) {
          result += " ";
        }
      } else {
        if (cell.getBorder() || prevCell?.getBorder()) {
          result += this.options.chars.middle;
        } else if (opts.hasBorder) {
          result += " ";
        }
      }
    }

    let maxLength: number = opts.width[colIndex];

    const colSpan: number = cell.getColSpan();
    if (colSpan > 1) {
      for (let o = 1; o < colSpan; o++) {
        // add padding and with of next cell
        maxLength += opts.width[colIndex + o] + opts.padding[colIndex + o];
        if (opts.hasBorder) {
          // add padding again and border with
          maxLength += opts.padding[colIndex + o] + 1;
        }
      }
    }

    const { current, next } = this.renderCellValue(cell, maxLength);

    row[colIndex].setValue(next);

    if (opts.hasBorder) {
      result += " ".repeat(opts.padding[colIndex]);
    }

    result += current;

    if (opts.hasBorder || colIndex < opts.columns - 1) {
      result += " ".repeat(opts.padding[colIndex]);
    }

    return result;
  }

  /**
   * Render specified length of cell. Returns the rendered value and a new cell
   * with the rest value.
   * @param cell      Cell to render.
   * @param maxLength Max length of content to render.
   */
  protected renderCellValue(
    cell: Cell,
    maxLength: number,
  ): { current: string; next: Cell } {
    const length: number = Math.min(
      maxLength,
      stripColor(cell.toString()).length,
    );
    let words: string = consumeWords(length, cell.toString());

    // break word if word is longer than max length
    const breakWord = stripColor(words).length > length;
    if (breakWord) {
      words = words.slice(0, length);
    }

    // get next content and remove leading space if breakWord is not true
    const next = cell.toString().slice(words.length + (breakWord ? 0 : 1));
    const fillLength = maxLength - stripColor(words).length;
    const current = words + " ".repeat(fillLength);

    return {
      current,
      next: cell.clone(next),
    };
  }

  /**
   * Render border row.
   * @param prevRow Previous row.
   * @param nextRow Next row.
   * @param rowSpan Current row span.
   * @param opts    Render options.
   */
  protected renderBorderRow(
    prevRow: Row<Cell> | undefined,
    nextRow: Row<Cell> | undefined,
    rowSpan: number[],
    opts: IRenderSettings,
  ): string {
    let result = "";

    let colSpan = 1;
    for (let colIndex = 0; colIndex < opts.columns; colIndex++) {
      if (rowSpan[colIndex] > 1) {
        if (!nextRow) {
          throw new Error("invalid layout");
        }
        if (colSpan > 1) {
          colSpan--;
          continue;
        }
      }
      result += this.renderBorderCell(
        colIndex,
        prevRow,
        nextRow,
        rowSpan,
        opts,
      );
      colSpan = nextRow?.[colIndex].getColSpan() ?? 1;
    }

    return result.length ? " ".repeat(this.options.indent) + result + "\n" : "";
  }

  /**
   * Render border cell.
   * @param colIndex  Current index.
   * @param prevRow   Previous row.
   * @param nextRow   Next row.
   * @param rowSpan   Current row span.
   * @param opts      Render options.
   */
  protected renderBorderCell(
    colIndex: number,
    prevRow: Row<Cell> | undefined,
    nextRow: Row<Cell> | undefined,
    rowSpan: number[],
    opts: IRenderSettings,
  ): string {
    // a1 | b1
    // -------
    // a2 | b2

    const a1: Cell | undefined = prevRow?.[colIndex - 1];
    const a2: Cell | undefined = nextRow?.[colIndex - 1];
    const b1: Cell | undefined = prevRow?.[colIndex];
    const b2: Cell | undefined = nextRow?.[colIndex];

    const a1Border = !!a1?.getBorder();
    const a2Border = !!a2?.getBorder();
    const b1Border = !!b1?.getBorder();
    const b2Border = !!b2?.getBorder();

    const hasColSpan = (cell: Cell | undefined): boolean =>
      (cell?.getColSpan() ?? 1) > 1;
    const hasRowSpan = (cell: Cell | undefined): boolean =>
      (cell?.getRowSpan() ?? 1) > 1;

    let result = "";

    if (colIndex === 0) {
      if (rowSpan[colIndex] > 1) {
        if (b1Border) {
          result += this.options.chars.left;
        } else {
          result += " ";
        }
      } else if (b1Border && b2Border) {
        result += this.options.chars.leftMid;
      } else if (b1Border) {
        result += this.options.chars.bottomLeft;
      } else if (b2Border) {
        result += this.options.chars.topLeft;
      } else {
        result += " ";
      }
    } else if (colIndex < opts.columns) {
      if ((a1Border && b2Border) || (b1Border && a2Border)) {
        const a1ColSpan: boolean = hasColSpan(a1);
        const a2ColSpan: boolean = hasColSpan(a2);
        const b1ColSpan: boolean = hasColSpan(b1);
        const b2ColSpan: boolean = hasColSpan(b2);

        const a1RowSpan: boolean = hasRowSpan(a1);
        const a2RowSpan: boolean = hasRowSpan(a2);
        const b1RowSpan: boolean = hasRowSpan(b1);
        const b2RowSpan: boolean = hasRowSpan(b2);

        const hasAllBorder = a1Border && b2Border && b1Border && a2Border;
        const hasAllRowSpan = a1RowSpan && b1RowSpan && a2RowSpan && b2RowSpan;
        const hasAllColSpan = a1ColSpan && b1ColSpan && a2ColSpan && b2ColSpan;

        if (hasAllRowSpan && hasAllBorder) {
          result += this.options.chars.middle;
        } else if (hasAllColSpan && hasAllBorder && a1 === b1 && a2 === b2) {
          result += this.options.chars.mid;
        } else if (a1ColSpan && b1ColSpan && a1 === b1) {
          result += this.options.chars.topMid;
        } else if (a2ColSpan && b2ColSpan && a2 === b2) {
          result += this.options.chars.bottomMid;
        } else if (a1RowSpan && a2RowSpan && a1 === a2) {
          result += this.options.chars.leftMid;
        } else if (b1RowSpan && b2RowSpan && b1 === b2) {
          result += this.options.chars.rightMid;
        } else {
          result += this.options.chars.midMid;
        }
      } else if (a1Border && b1Border) {
        if (hasColSpan(a1) && hasColSpan(b1) && a1 === b1) {
          result += this.options.chars.bottom;
        } else {
          result += this.options.chars.bottomMid;
        }
      } else if (b1Border && b2Border) {
        if (rowSpan[colIndex] > 1) {
          result += this.options.chars.left;
        } else {
          result += this.options.chars.leftMid;
        }
      } else if (b2Border && a2Border) {
        if (hasColSpan(a2) && hasColSpan(b2) && a2 === b2) {
          result += this.options.chars.top;
        } else {
          result += this.options.chars.topMid;
        }
      } else if (a1Border && a2Border) {
        if (hasRowSpan(a1) && a1 === a2) {
          result += this.options.chars.right;
        } else {
          result += this.options.chars.rightMid;
        }
      } else if (a1Border) {
        result += this.options.chars.bottomRight;
      } else if (b1Border) {
        result += this.options.chars.bottomLeft;
      } else if (a2Border) {
        result += this.options.chars.topRight;
      } else if (b2Border) {
        result += this.options.chars.topLeft;
      } else {
        result += " ";
      }
    }

    const length = opts.padding[colIndex] + opts.width[colIndex] +
      opts.padding[colIndex];

    if (rowSpan[colIndex] > 1 && nextRow) {
      result += this.renderCell(
        colIndex,
        nextRow,
        prevRow,
        rowSpan,
        opts,
        true,
      );
      if (nextRow[colIndex] === nextRow[nextRow.length - 1]) {
        if (b1Border) {
          result += this.options.chars.right;
        } else {
          result += " ";
        }
        return result;
      }
    } else if (b1Border && b2Border) {
      result += this.options.chars.mid.repeat(length);
    } else if (b1Border) {
      result += this.options.chars.bottom.repeat(length);
    } else if (b2Border) {
      result += this.options.chars.top.repeat(length);
    } else {
      result += " ".repeat(length);
    }

    if (colIndex === opts.columns - 1) {
      if (b1Border && b2Border) {
        result += this.options.chars.rightMid;
      } else if (b1Border) {
        result += this.options.chars.bottomRight;
      } else if (b2Border) {
        result += this.options.chars.topRight;
      } else {
        result += " ";
      }
    }

    return result;
  }
}
