//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!   ,----
//! 1 | for (this in b) {
//!   :      ^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
