//!
//!  x A parameter initializer is only allowed in a function or constructor implementation
//!   ,----
//! 2 | function fn1(x = 3);
//!   :              ^^^^^
//!   `----
//!
//!  x A parameter initializer is only allowed in a function or constructor implementation
//!     ,----
//! 116 | function initExpr(n = 13);
//!     :                   ^^^^^^
//!     `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
