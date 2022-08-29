//// [parser_continueNotInIterationStatement4.ts]
//! 
//!   x A 'continue' statement can only jump to a label of an enclosing iteration statement
//!    ,----
//!  4 | continue TWO;
//!    : ^^^^^^^^^^^^^
//!    `----
