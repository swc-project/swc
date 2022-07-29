//!
//!  x A class can only have one constructor
//!   ,----
//! 3 | constructor(x) { } // error
//!   : ^^^^^^^^^^^^^^^^^^
//!   `----
//!
//!  x A class can only have one constructor
//!   ,----
//! 8 | constructor(x: T, y: T) { } // error
//!   : ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
