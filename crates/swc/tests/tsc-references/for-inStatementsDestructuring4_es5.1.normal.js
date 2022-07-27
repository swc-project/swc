//!
//!  x The left-hand side of a 'for...in' statement cannot be a destructuring pattern
//!   ,----
//! 2 | for ({a, b} in []) { }
//!   :      ^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
