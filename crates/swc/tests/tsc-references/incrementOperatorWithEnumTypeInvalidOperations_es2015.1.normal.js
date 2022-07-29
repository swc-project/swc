//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 14 | var ResultIsNumber5 = ++(ENUM[1] + ENUM[2]);
//!    :                         ^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 15 | var ResultIsNumber6 = (ENUM[1] + ENUM[2])++;
//!    :                       ^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
