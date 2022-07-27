//!
//!  x A parameter property is only allowed in a constructor implementation
//!   ,----
//! 1 | var v = (public x: string) => { };
//!   :          ^^^^^^^^^^^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
