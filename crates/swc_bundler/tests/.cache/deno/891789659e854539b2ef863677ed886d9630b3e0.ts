// Loaded from https://deno.land/x/sqlite@v2.3.1/src/row_objects.ts


import { ColumnName, Empty, Rows } from "./rows.ts";

export class RowObjects<T extends any = Record<string, any>> {
  private _rows: Rows;
  private _columns?: ColumnName[];

  /**
   * RowObjects
   *
   * RowObjects represent a set of results 
   * from a query in the form of an object.
   * They are iterable and yield objects.
   *
   * This class is not exported from the module
   * and the only correct way to obtain a `RowObjects`
   * object is by making a database query
   * and using the `asObject()` method on the `Rows` result.
   */
  constructor(rows: Rows) {
    this._rows = rows;

    if (rows !== Empty) {
      this._columns = this._rows.columns();
    }
  }

  /**
   * RowObjects.return
   *
   * Implements the closing iterator
   * protocol. See also:
   * https://exploringjs.com/es6/ch_iteration.html#sec_closing-iterators
   */
  return(): IteratorResult<T> {
    return this._rows.return();
  }

  /**
   * RowObjects.next
   *
   * Implements the iterator protocol.
   */
  next(): IteratorResult<T> {
    const { value, done } = this._rows.next();
    if (done) {
      return { value: value, done: true };
    }

    const rowAsObject: any = {};

    for (let i = 0; i < value.length; i++) {
      rowAsObject[this._columns![i].name] = value[i];
    }

    return { value: rowAsObject, done: false };
  }

  [Symbol.iterator]() {
    return this;
  }
}
