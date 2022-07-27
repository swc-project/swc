//!
//!  x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!   ,----
//! 4 | var arguments = "hello";
//!   :     ^^^^^^^^^
//!   `----
//!
//!  x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!   ,----
//! 6 | const arguments = 100;
//!   :       ^^^^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
