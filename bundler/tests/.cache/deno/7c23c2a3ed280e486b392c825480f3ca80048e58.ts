// Loaded from https://deno.land/x/sqlite@v2.3.1/src/db.ts


import instantiate from "../build/sqlite.js";
import { getStr, setArr, setStr } from "./wasm.ts";
import { Status, Values } from "./constants.ts";
import SqliteError from "./error.ts";
import { Empty, Rows } from "./rows.ts";

// Possible parameters to be bound to a query
type QueryParam =
  | boolean
  | number
  | bigint
  | string
  | null
  | undefined
  | Date
  | Uint8Array;

export class DB {
  private _wasm: any;
  private _open: boolean;
  private _transactions: Set<Rows>;

  /**
   * DB
   *
   * Create a new database. The passed
   * path will be opened with read/ write
   * permissions and created if it does not
   * already exist.
   *
   * The default opens an in-memory database.
   */
  constructor(path: string = ":memory:") {
    this._wasm = instantiate().exports;
    this._open = false;
    this._transactions = new Set();

    // Try to open the database
    let status;
    setStr(this._wasm, path, (ptr) => {
      status = this._wasm.open(ptr);
    });
    if (status !== Status.SqliteOk) {
      throw this._error();
    }
    this._open = true;
  }

  /**
   * DB.query
   *
   * Run a query against the database. The query
   * can contain placeholder parameters, which
   * are bound to the values passed in 'values'.
   *
   *     db.query("SELECT name, email FROM users WHERE subscribed = ? AND list LIKE ?", [true, listName]);
   *
   * This supports positional and named parameters.
   * Positional parameters can be set by passing an
   * array for values. Named parameters can be set
   * by passing an object for values.
   *
   * While they can be mixed in principle, this is
   * not recommended.
   *
   * | Parameter     | Values                  |
   * |---------------|-------------------------|
   * | `?NNN` or `?` | NNN-th value in array   |
   * | `:AAAA`       | value `AAAA` or `:AAAA` |
   * | `@AAAA`       | value `@AAAA`           |
   * | `$AAAA`       | value `$AAAA`           |
   *
   * (see https://www.sqlite.org/lang_expr.html)
   *
   * Values may only be of the following
   * types and are converted as follows:
   *
   * | JS in      | SQL type        | JS out           |
   * |------------|-----------------|------------------|
   * | number     | INTEGER or REAL | number or bigint |
   * | bigint     | INTEGER         | number or bigint |
   * | boolean    | INTEGER         | number           |
   * | string     | TEXT            | string           |
   * | Date       | TEXT            | string           |
   * | Uint8Array | BLOB            | Uint8Array       |
   * | null       | NULL            | null             |
   * | undefined  | NULL            | null             |
   *
   * If no value is provided to a given parameter,
   * SQLite will default to NULL.
   *
   * If a `bigint` is bound, it is converted to a
   * signed 64 big integer, which may not be lossless.
   * If an integer value is read from the database, which
   * is too big to safely be contained in a `number`, it
   * is automatically returned as a `bigint`.
   *
   * If a `Date` is bound, it will be converted to
   * an ISO 8601 string: `YYYY-MM-DDTHH:MM:SS.SSSZ`.
   * This format is understood by built-in SQLite
   * date-time functions. Also see
   * https://sqlite.org/lang_datefunc.html.
   *
   * This always returns an iterable Rows object.
   * As a special case, if the query has no rows
   * to return this returns the Empty row (which
   * is also iterable, but has zero entries).
   *
   * !> Any returned Rows object needs to be fully
   * iterated over or discarded by calling
   * `.return()` or closing the iterator.
   */
  query(sql: string, values?: object | QueryParam[]): Rows {
    if (!this._open) {
      throw new SqliteError("Database was closed.");
    }

    // Prepare sqlite query statement
    let stmt: number = Values.Null;
    setStr(this._wasm, sql, (ptr) => {
      stmt = this._wasm.prepare(ptr);
    });
    if (stmt === Values.Null) {
      throw this._error();
    }

    // Prepare parameter array
    let parameters: any[] = [];
    if (Array.isArray(values)) {
      parameters = values;
    } else if (typeof values === "object") {
      // Resolve parameter index for named values
      for (const key of Object.keys(values)) {
        let idx = Values.Error;
        // Prepend ':' to name, if it does not have a special starting character
        let name = key;
        if (name[0] !== ":" && name[0] !== "@" && name[0] !== "$") {
          name = `:${name}`;
        }
        setStr(this._wasm, name, (ptr) => {
          idx = this._wasm.bind_parameter_index(stmt, ptr);
        });
        if (idx === Values.Error) {
          this._wasm.finalize(stmt);
          throw new SqliteError(`No parameter named '${name}'.`);
        }
        parameters[idx - 1] = (values as any)[key];
      }
    }

    // Bind parameters
    for (let i = 0; i < parameters.length; i++) {
      let value = parameters[i];
      let status;
      switch (typeof value) {
        case "boolean":
          value = value ? 1 : 0;
        // fall through
        case "number":
          if (Number.isSafeInteger(value)) {
            status = this._wasm.bind_int(stmt, i + 1, value);
          } else {
            status = this._wasm.bind_double(stmt, i + 1, value);
          }
          break;
        case "bigint":
          // bigint is bound as a string and converted to i64 on C side
          setStr(this._wasm, value.toString(), (ptr) => {
            status = this._wasm.bind_big_int(stmt, i + 1, ptr);
          });
          break;
        case "string":
          setStr(this._wasm, value, (ptr) => {
            status = this._wasm.bind_text(stmt, i + 1, ptr);
          });
          break;
        default:
          if (value instanceof Date) {
            // Dates are allowed and bound to TEXT, formatted `YYYY-MM-DDTHH:MM:SS.SSSZ`
            setStr(this._wasm, value.toISOString(), (ptr) => {
              status = this._wasm.bind_text(stmt, i + 1, ptr);
            });
          } else if (value instanceof Uint8Array) {
            // Uint8Arrays are allowed and bound to BLOB
            setArr(this._wasm, value, (ptr) => {
              status = this._wasm.bind_blob(stmt, i + 1, ptr, value.length);
            });
          } else if (value === null || value === undefined) {
            // Both null and undefined result in a NULL entry
            status = this._wasm.bind_null(stmt, i + 1);
          } else {
            this._wasm.finalize(stmt);
            throw new SqliteError(`Can not bind ${typeof value}.`);
          }
          break;
      }
      if (status !== Status.SqliteOk) {
        this._wasm.finalize(stmt);
        throw this._error(status);
      }
    }

    // Step once to handle case where result is empty
    const status = this._wasm.step(stmt);
    switch (status) {
      case Status.SqliteDone:
        this._wasm.finalize(stmt);
        return Empty;
        break;
      case Status.SqliteRow:
        const transaction = new Rows(this, stmt);
        this._transactions.add(transaction);
        return transaction;
        break;
      default:
        this._wasm.finalize(stmt);
        throw this._error(status);
        break;
    }
  }

  /**
   * DB.close
   *
   * Close database handle. This must be called if
   * DB is no longer used, to avoid leaking file
   * resources.
   *
   * If force is specified, any on-going transactions
   * will be closed.
   */
  close(force: boolean = false) {
    if (!this._open) {
      return;
    }
    if (force) {
      for (const transaction of this._transactions) {
        transaction.return();
      }
    }
    if (this._wasm.close() !== Status.SqliteOk) {
      throw this._error();
    }
    this._open = false;
  }

  /**
   * DB.lastInsertRowId
   *
   * Get last inserted row id. This corresponds to
   * the SQLite function `sqlite3_last_insert_rowid`.
   * 
   * By default, it will return 0 if there is no row
   * inserted yet.
   */
  get lastInsertRowId(): number {
    return this._wasm.last_insert_rowid();
  }

  /**
   * DB.changes
   *
   * Return the number of rows modified, inserted or
   * deleted by the most recently completed query.
   * This corresponds to the SQLite function
   * `sqlite3_changes`.
   */
  get changes(): number {
    return this._wasm.changes();
  }

  /**
   * DB.totalChanges
   *
   * Return the number of rows modified, inserted or
   * deleted since the database was opened.
   * This corresponds to the SQLite function
   * `sqlite3_total_changes`.
   */
  get totalChanges(): number {
    return this._wasm.total_changes();
  }

  private _error(code?: number): SqliteError {
    if (code === undefined) {
      code = this._wasm.get_status() as number;
    }
    const msg = getStr(this._wasm, this._wasm.get_sqlite_error_str());
    return new SqliteError(msg, code);
  }
}
