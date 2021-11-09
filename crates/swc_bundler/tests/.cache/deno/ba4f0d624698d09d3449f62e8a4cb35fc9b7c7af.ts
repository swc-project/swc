// Loaded from https://deno.land/x/cliffy@v0.18.0/table/table.ts


import { border, IBorder } from "./border.ts";
import { Cell } from "./cell.ts";
import { TableLayout } from "./layout.ts";
import { IDataRow, IRow, Row } from "./row.ts";

/** Border characters settings. */
export type IBorderOptions = Partial<IBorder>;

/** Table options. */
export interface ITableOptions {
  indent?: number;
  border?: boolean;
  maxColWidth?: number | number[];
  minColWidth?: number | number[];
  padding?: number | number[];
  chars?: IBorderOptions;
}

/** Table settings. */
export interface ITableSettings extends Required<ITableOptions> {
  chars: IBorder;
}

/** Table type. */
export type ITable<T extends IRow = IRow> = T[] | Table<T>;

/** Table representation. */
export class Table<T extends IRow = IRow> extends Array<T> {
  protected static _chars: IBorder = { ...border };
  protected options: ITableSettings = {
    indent: 0,
    border: false,
    maxColWidth: Infinity,
    minColWidth: 0,
    padding: 1,
    chars: { ...Table._chars },
  };
  private headerRow?: Row;

  /**
   * Create a new table. If rows is a table, all rows and options of the table
   * will be copied to the new table.
   * @param rows
   */
  public static from<T extends IRow>(rows: ITable<T>): Table<T> {
    const table = new this(...rows);
    if (rows instanceof Table) {
      table.options = { ...rows.options };
      table.headerRow = rows.headerRow ? Row.from(rows.headerRow) : undefined;
    }
    return table;
  }

  /**
   * Create a new table from an array of json objects. An object represents a
   * row and each property a column.
   * @param rows Array of objects.
   */
  public static fromJson(rows: IDataRow[]): Table {
    return new this().fromJson(rows);
  }

  /**
   * Set global default border characters.
   * @param chars Border options.
   */
  public static chars(chars: IBorderOptions): typeof Table {
    Object.assign(this._chars, chars);
    return this;
  }

  /**
   * Write table or rows to stdout.
   * @param rows Table or rows.
   */
  public static render<T extends IRow>(rows: ITable<T>): void {
    Table.from(rows).render();
  }

  /**
   * Read data from an array of json objects. An object represents a
   * row and each property a column.
   * @param rows Array of objects.
   */
  public fromJson(rows: IDataRow[]): this {
    this.header(Object.keys(rows[0]));
    this.body(rows.map((row) => Object.values(row) as T));
    return this;
  }

  /**
   * Set table header.
   * @param header Header row or cells.
   */
  public header(header: IRow): this {
    this.headerRow = header instanceof Row ? header : Row.from(header);
    return this;
  }

  /**
   * Set table body.
   * @param rows Table rows.
   */
  public body(rows: T[]): this {
    this.length = 0;
    this.push(...rows);
    return this;
  }

  /** Clone table recursively with header and options. */
  public clone(): Table {
    const table = new Table(
      ...this.map((row: T) =>
        row instanceof Row ? row.clone() : Row.from(row).clone()
      ),
    );
    table.options = { ...this.options };
    table.headerRow = this.headerRow?.clone();
    return table;
  }

  /** Generate table string. */
  public toString(): string {
    return new TableLayout(this, this.options).toString();
  }

  /** Write table to stdout. */
  public render(): this {
    Deno.stdout.writeSync(new TextEncoder().encode(this.toString() + "\n"));
    return this;
  }

  /**
   * Set max col with.
   * @param width     Max col width.
   * @param override  Override existing value.
   */
  public maxColWidth(width: number | number[], override = true): this {
    if (override || typeof this.options.maxColWidth === "undefined") {
      this.options.maxColWidth = width;
    }
    return this;
  }

  /**
   * Set min col width.
   * @param width     Min col width.
   * @param override  Override existing value.
   */
  public minColWidth(width: number | number[], override = true): this {
    if (override || typeof this.options.minColWidth === "undefined") {
      this.options.minColWidth = width;
    }
    return this;
  }

  /**
   * Set table indentation.
   * @param width     Indent width.
   * @param override  Override existing value.
   */
  public indent(width: number, override = true): this {
    if (override || typeof this.options.indent === "undefined") {
      this.options.indent = width;
    }
    return this;
  }

  /**
   * Set cell padding.
   * @param padding   Cell padding.
   * @param override  Override existing value.
   */
  public padding(padding: number | number[], override = true): this {
    if (override || typeof this.options.padding === "undefined") {
      this.options.padding = padding;
    }
    return this;
  }

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
   * Set border characters.
   * @param chars Border options.
   */
  public chars(chars: IBorderOptions): this {
    Object.assign(this.options.chars, chars);
    return this;
  }

  /** Get table header. */
  public getHeader(): Row | undefined {
    return this.headerRow;
  }

  /** Get table body. */
  public getBody(): T[] {
    return this.slice();
  }

  /** Get mac col widrth. */
  public getMaxColWidth(): number | number[] {
    return this.options.maxColWidth;
  }

  /** Get min col width. */
  public getMinColWidth(): number | number[] {
    return this.options.minColWidth;
  }

  /** Get table indentation. */
  public getIndent(): number {
    return this.options.indent;
  }

  /** Get cell padding. */
  public getPadding(): number | number[] {
    return this.options.padding;
  }

  /** Check if table has border. */
  public getBorder(): boolean {
    return this.options.border === true;
  }

  /** Check if header row has border. */
  public hasHeaderBorder(): boolean {
    return this.getBorder() || (
      this.headerRow instanceof Row && this.headerRow.hasBorder()
    );
  }

  /** Check if table bordy has border. */
  public hasBodyBorder(): boolean {
    return this.getBorder() ||
      this.some((row) =>
        row instanceof Row
          ? row.hasBorder()
          : row.some((cell) => cell instanceof Cell ? cell.getBorder : false)
      );
  }

  /** Check if table header or body has border. */
  public hasBorder(): boolean {
    return this.hasHeaderBorder() || this.hasBodyBorder();
  }
}
