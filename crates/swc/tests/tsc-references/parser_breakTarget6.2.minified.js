//// [parser_breakTarget6.ts]
//! 
//!   x A 'break' statement can only jump to a label of an enclosing statement
//!    ,----
//!  2 | break target;
//!    : ^^^^^^^^^^^^^
//!    `----
