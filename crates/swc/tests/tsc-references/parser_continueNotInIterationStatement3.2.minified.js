//// [parser_continueNotInIterationStatement3.ts]
//! 
//!   x A 'continue' statement can only jump to a label of an enclosing iteration statement
//!    ,----
//!  3 | continue;
//!    : ^^^^^^^^^
//!    `----
