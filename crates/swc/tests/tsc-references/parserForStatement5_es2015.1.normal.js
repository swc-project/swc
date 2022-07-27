//!
//!  x The left-hand side of a 'for...in' statement cannot be a destructuring pattern
//!   ,----
//! 1 | for ({} in b) {
//!   :      ^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
