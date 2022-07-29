//!
//!  x A parameter property is only allowed in a constructor implementation
//!   ,----
//! 2 | constructor(readonly x: number);
//!   :             ^^^^^^^^^^^^^^^^^^
//!   `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!   ,----
//! 3 | method(readonly x: number);
//!   :        ^^^^^^^^^^^^^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
