//!
//!  x The left-hand side of a 'for...of' statement cannot use a type annotation
//!   ,----
//! 1 | for (var a: number in X) {
//!   :          ^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
