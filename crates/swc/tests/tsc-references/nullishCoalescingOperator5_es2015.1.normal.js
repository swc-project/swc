//!
//!  x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!   ,----
//! 8 | a ?? b || c;
//!   : ^^^^^^^^^^^
//!   `----
//!
//!  x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!    ,----
//! 11 | a || b ?? c;
//!    : ^^^^^^
//!    `----
//!
//!  x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!    ,----
//! 14 | a ?? b && c;
//!    :      ^^^^^^
//!    `----
//!
//!  x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!    ,----
//! 17 | a && b ?? c;
//!    : ^^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
