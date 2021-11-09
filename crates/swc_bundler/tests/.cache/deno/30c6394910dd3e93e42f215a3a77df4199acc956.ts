// Loaded from https://deno.land/x/sqlite@v2.3.1/src/rows.ts


import { getStr } from "./wasm.ts";
import { Status, Types, Values } from "./constants.ts";
import SqliteError from "./error.ts";
import { RowObjects } from "./row_objects.ts";

export interface ColumnName {
  name: string;
  originName: string;
  tableName: string;
}

export class Rows {
  private _db: any;
  private _stmt: number;
  private _done: boolean;

  /**
   * Rows
   *
   * Rows represent a set of results from a query.
   * They are iterable and yield arrays with
   * the data from the selected columns.
   *
   * This class is not exported from the module
   * and the only correct way to obtain a `Rows`
   * object is by making a database query.
   */
  constructor(db: any, stmt: number) {
    this._db = db;
    this._stmt = stmt;
    this._done = false;

    if (!this._db) {
      this._done = true;
    }
  }

  /**
   * Rows.return
   *
   * Implements the closing iterator
   * protocol. See also:
   * https://exploringjs.com/es6/ch_iteration.html#sec_closing-iterators
   */
  return(): IteratorResult<any> {
    if (this._done) {
      return { done: true, value: undefined };
    }
    // Release transaction slot
    this._db._wasm.finalize(this._stmt);
    this._db._transactions.delete(this);
    this._done = true;
    return { done: true, value: undefined };
  }

  /**
   * Rows.done
   *
   * Deprecated, prefer `Rows.return`.
   */
  done() {
    this.return();
  }

  /**
   * Rows.next
   *
   * Implements the iterator protocol.
   */
  next(): IteratorResult<any[]> {
    if (this._done) return { value: undefined, done: true };
    // Load row data and advance statement
    const row = this._get();
    const status = this._db._wasm.step(this._stmt);
    switch (status) {
      case Status.SqliteRow:
        // NO OP
        break;
      case Status.SqliteDone:
        this.return();
        break;
      default:
        this.return();
        throw this._db._error(status);
        break;
    }
    return { value: row, done: false };
  }

  /**
   * Rows.columns
   *
   * Call this if you need column names from the result of a select query.
   *
   * This method returns an array of objects, where each object has the following properties:
   *
   * | Property     | Value                                      |
   * |--------------|--------------------------------------------|
   * | `name`       | the result of `sqlite3_column_name`        |
   * | `originName` | the result of `sqlite3_column_origin_name` |
   * | `tableName`  | the result of `sqlite3_column_table_name`  |
   */
  columns(): ColumnName[] {
    if (this._done) {
      throw new SqliteError(
        "Unable to retrieve column names as transaction is finalized.",
      );
    }

    const columnCount = this._db._wasm.column_count(this._stmt);
    const columns: ColumnName[] = [];
    for (let i = 0; i < columnCount; i++) {
      const name = getStr(
        this._db._wasm,
        this._db._wasm.column_name(this._stmt, i),
      );
      const originName = getStr(
        this._db._wasm,
        this._db._wasm.column_origin_name(this._stmt, i),
      );
      const tableName = getStr(
        this._db._wasm,
        this._db._wasm.column_table_name(this._stmt, i),
      );
      columns.push({ name, originName, tableName });
    }
    return columns;
  }

  /**
   * Rows.asObjects
   * 
   * Call this if you need to ouput the rows as objects.
   * 
   *     const rows = [...db.query("SELECT name FROM users;").asObjects()];
   */
  asObjects<T extends any = Record<string, any>>(): RowObjects<T> {
    return new RowObjects<T>(this);
  }

  [Symbol.iterator]() {
    return this;
  }

  private _get(): any[] {
    // Get results from row
    const row = [];
    // return row;
    for (
      let i = 0, c = this._db._wasm.column_count(this._stmt);
      i < c;
      i++
    ) {
      switch (this._db._wasm.column_type(this._stmt, i)) {
        case Types.Integer:
          row.push(this._db._wasm.column_int(this._stmt, i));
          break;
        case Types.Float:
          row.push(this._db._wasm.column_double(this._stmt, i));
          break;
        case Types.Text:
          row.push(
            getStr(
              this._db._wasm,
              this._db._wasm.column_text(this._stmt, i),
            ),
          );
          break;
        case Types.Blob: {
          const ptr = this._db._wasm.column_blob(this._stmt, i);
          if (ptr === 0) {
            // Zero pointer results in null
            row.push(null);
          } else {
            const length = this._db._wasm.column_bytes(this._stmt, i);
            // Slice should copy the bytes, as it makes a shallow copy
            row.push(
              new Uint8Array(this._db._wasm.memory.buffer, ptr, length).slice(),
            );
          }
          break;
        }
        case Types.BigInteger: {
          const ptr = this._db._wasm.column_text(this._stmt, i);
          row.push(BigInt(getStr(this._db._wasm, ptr)));
          break;
        }
        default:
          // TODO: Differentiate between NULL and not-recognized?
          row.push(null);
          break;
      }
    }
    return row;
  }
}

/**
 * Empty
 *
 * A special constant. This is a `Rows` object
 * which has no results. It is still iterable,
 * however it won't yield any results.
 *
 * `Empty` is returned from queries which return
 * no data.
 */
export const Empty = new Rows(null, Values.Null);
