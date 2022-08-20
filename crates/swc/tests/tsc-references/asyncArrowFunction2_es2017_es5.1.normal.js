//!
//!  x `await` is a reserved word that cannot be used as an identifier.
//!   ,----
//! 3 | var f = (await) => {
//!   :          ^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
