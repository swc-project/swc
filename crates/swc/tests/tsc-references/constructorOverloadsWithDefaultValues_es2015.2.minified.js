//!
//!  x A parameter initializer is only allowed in a function or constructor implementation
//!   ,----
//! 3 | constructor(x = 1); // error
//!   :             ^^^^^
//!   `----
//!
//!  x A parameter initializer is only allowed in a function or constructor implementation
//!    ,----
//! 10 | constructor(x = 1); // error
//!    :             ^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
