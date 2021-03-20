// Loaded from https://deno.land/x/cliffy@v0.18.0/table/cell.ts


/** Cell type */
// deno-lint-ignore ban-types
export type ICell = number | string | String | Cell;

/** Cell options. */
export interface ICellOptions {
  border?: boolean;
  colSpan?: number;
  rowSpan?: number;
}

/** Cell representation. */
export class Cell {
  protected options: ICellOptions = {};

  /** Get cell length. */
  public get length(): number {
    return this.toString().length;
  }

  /**
   * Create a new cell. If value is a cell, the value and all options of the cell
   * will be copied to the new cell.
   * @param value Cell or cell value.
   */
  public static from(value: ICell): Cell {
    const cell = new this(value);
    if (value instanceof Cell) {
      cell.options = { ...value.options };
    }
    return cell;
  }

  /**
   * Cell constructor.
   * @param value Cell value.
   */
  public constructor(private value: ICell) {}

  /** Get cell value. */
  public toString(): string {
    return this.value.toString();
  }

  /**
   * Set cell value.
   * @param value Cell or cell value.
   */
  public setValue(value: ICell): this {
    this.value = value;
    return this;
  }

  /**
   * Clone cell with all options.
   * @param value Cell or cell value.
   */
  public clone(value?: ICell): Cell {
    const cell = new Cell(value ?? this);
    cell.options = { ...this.options };
    return cell;
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
   * Set col span.
   * @param span      Number of cols to span.
   * @param override  Override existing value.
   */
  public colSpan(span: number, override = true): this {
    if (override || typeof this.options.colSpan === "undefined") {
      this.options.colSpan = span;
    }
    return this;
  }

  /**
   * Set row span.
   * @param span      Number of rows to span.
   * @param override  Override existing value.
   */
  public rowSpan(span: number, override = true): this {
    if (override || typeof this.options.rowSpan === "undefined") {
      this.options.rowSpan = span;
    }
    return this;
  }

  /**
   * Getter:
   */

  /** Check if cell has border. */
  public getBorder(): boolean {
    return this.options.border === true;
  }

  /** Get col span. */
  public getColSpan(): number {
    return typeof this.options.colSpan === "number" && this.options.colSpan > 0
      ? this.options.colSpan
      : 1;
  }

  /** Get row span. */
  public getRowSpan(): number {
    return typeof this.options.rowSpan === "number" && this.options.rowSpan > 0
      ? this.options.rowSpan
      : 1;
  }
}
