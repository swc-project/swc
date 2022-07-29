//!
//!  x Unknown regular expression flags.
//!   ,----
//! 1 | if (1) /regexp/a.foo();
//!   :        ^^^^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
