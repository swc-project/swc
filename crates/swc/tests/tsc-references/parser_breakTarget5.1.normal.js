//// [parser_breakTarget5.ts]
//! 
//!   x A 'break' statement can only jump to a label of an enclosing statement
//!    ,----
//!  5 | break target;
//!    : ^^^^^^^^^^^^^
//!    `----
