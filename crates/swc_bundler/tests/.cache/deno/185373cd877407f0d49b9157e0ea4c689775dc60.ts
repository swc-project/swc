// Loaded from https://deno.land/x/sqlite@v2.3.1/src/error.ts


import { Status } from "./constants.ts";

export default class SqliteError extends Error {
  /**
   * SqliteError
   *
   * Extension over the standard JS Error object
   * to also contain class members for error code
   * and error code name.
   *
   * This class is not exported by the module and
   * should only be obtained from exceptions raised
   * in this module.
   */
  constructor(message: string, code?: number) {
    super(message);
    this.name = "SqliteError";
    this.code = typeof code === "number" ? code : Status.Unknown;
  }

  /**
   * SqliteError.code
   *
   * The SQLite result status code,
   * see the SQLite docs for more
   * information about each code.
   *
   * https://www.sqlite.org/rescode.html
   *
   * Beyond the SQLite status codes, this member
   * can also contain custom status codes specific
   * to this library (starting from 1000).
   *
   * Errors that originate in the JavaScript part of
   * the library will not have an associated status
   * code. For these errors, the code will be
   * `Status.Unknown`.
   *
   * | JS name          | code | JS name (cont.)  | code |
   * |------------------|------|------------------|------|
   * | SqliteOk         | 0    | SqliteEmpty      | 16   |
   * | SqliteError      | 1    | SqliteSchema     | 17   |
   * | SqliteInternal   | 2    | SqliteTooBig     | 18   |
   * | SqlitePerm       | 3    | SqliteConstraint | 19   |
   * | SqliteAbort      | 4    | SqliteMismatch   | 20   |
   * | SqliteBusy       | 5    | SqliteMisuse     | 21   |
   * | SqliteLocked     | 6    | SqliteNoLFS      | 22   |
   * | SqliteNoMem      | 7    | SqliteAuth       | 23   |
   * | SqliteReadOnly   | 8    | SqliteFormat     | 24   |
   * | SqliteInterrupt  | 9    | SqliteRange      | 25   |
   * | SqliteIOErr      | 10   | SqliteNotADB     | 26   |
   * | SqliteCorrupt    | 11   | SqliteNotice     | 27   |
   * | SqliteNotFound   | 12   | SqliteWarning    | 28   |
   * | SqliteFull       | 13   | SqliteRow        | 100  |
   * | SqliteCantOpen   | 14   | SqliteDone       | 101  |
   * | SqliteProtocol   | 15   | Unknown          | -1   |
   *
   * These codes are accessible via
   * the exported `Status` object.
   */
  code: number;

  /**
   * SqliteError.codeName
   *
   * Key of code in exported `status`
   * object.
   *
   * E.g. if `code` is `19`,
   * `codeName` would be `SqliteConstraint`.
   */
  get codeName(): keyof typeof Status {
    return Status[this.code] as keyof typeof Status;
  }
}
