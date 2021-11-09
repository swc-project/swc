// Loaded from https://deno.land/x/sqlite@v2.3.1/src/constants.ts


export enum Status {
  Unknown = -1, // Unknown status

  SqliteOk = 0, // Successful result
  SqliteError = 1, // Generic error
  SqliteInternal = 2, // Internal logic error in SQLite
  SqlitePerm = 3, // Access permission denied
  SqliteAbort = 4, // Callback routine requested an abort
  SqliteBusy = 5, // The database file is locked
  SqliteLocked = 6, // A table in the database is locked
  SqliteNoMem = 7, // A malloc() failed
  SqliteReadOnly = 8, // Attempt to write a readonly database
  SqliteInterrupt = 9, // Operation terminated by sqlite3_interrupt()
  SqliteIOErr = 10, // Some kind of disk I/O error occurred
  SqliteCorrupt = 11, // The database disk image is malformed
  SqliteNotFound = 12, // Unknown opcode in sqlite3_file_control()
  SqliteFull = 13, // Insertion failed because database is full
  SqliteCantOpen = 14, // Unable to open the database file
  SqliteProtocol = 15, // Database lock protocol error
  SqliteEmpty = 16, // Internal use only
  SqliteSchema = 17, // The database schema changed
  SqliteTooBig = 18, // String or BLOB exceeds size limit
  SqliteConstraint = 19, // Abort due to constraint violation
  SqliteMismatch = 20, // Data type mismatch
  SqliteMisuse = 21, // Library used incorrectly
  SqliteNoLFS = 22, // Uses OS features not supported on host
  SqliteAuth = 23, // Authorization denied
  SqliteFormat = 24, // Not used
  SqliteRange = 25, // 2nd parameter to sqlite3_bind out of range
  SqliteNotADB = 26, // File opened that is not a database file
  SqliteNotice = 27, // Notifications from sqlite3_log()
  SqliteWarning = 28, // Warnings from sqlite3_log()
  SqliteRow = 100, // sqlite3_step() has another row ready
  SqliteDone = 101, // sqlite3_step() has finished executing
}

export enum Types {
  Integer = 1,
  Float = 2,
  Text = 3,
  Blob = 4,
  Null = 5,
  BigInteger = 6,
}

export enum Values {
  Error = -1,
  Null = 0,
}
