// Loaded from https://deno.land/x/cliffy@v0.18.0/table/row.ts


import { Cell, ICell } from "./cell.ts";

/** Row type */
export type IRow<T extends ICell = ICell> = T[] | Row<T>;
/** Json row. */
export type IDataRow = Record<string, string | number>;

/** Row options. */
export interface IRowOptions {
  indent?: number;
  border?: boolean;
}

/**
 * Row representation.
 */
export class Row<T extends ICell = ICell> extends Array<T> {
  protected options: IRowOptions = {};

  /**
   * Create a new row. If cells is a row, all cells and options of the row will
   * be copied to the new row.
   * @param cells Cells or row.
   */
  public static from<T extends ICell = ICell>(cells: IRow<T>): Row<T> {
    const row = new this(...cells);
    if (cells instanceof Row) {
      row.options = { ...cells.options };
    }
    return row;
  }

  /** Clone row recursively with all options. */
  public clone(): Row {
    const row = new Row(
      ...this.map((cell: T) => cell instanceof Cell ? cell.clone() : cell),
    );
    row.options = { ...this.options };
    return row;
  }

  /**
   * Setter:
   */

  /**
   * Enable/disable cell border.
   * @param enable    Enable/disable cell border.
   * @param override  Override existing value.
   */
  public border(enable: boolean, override = true): this {
    if (override || typeof this.options.border === "undefined") {
      this.options.border = enable;
    }
    return this;
  }

  /**
   * Getter:
   */

  /** Check if row has border. */
  public getBorder(): boolean {
    return this.options.border === true;
  }

  /** Check if row or any child cell has border. */
  public hasBorder(): boolean {
    return this.getBorder() ||
      this.some((cell) => cell instanceof Cell && cell.getBorder());
  }
}
