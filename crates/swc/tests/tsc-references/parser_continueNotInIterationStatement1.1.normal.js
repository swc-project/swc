//// [parser_continueNotInIterationStatement1.ts]
//! 
//!   x A 'continue' statement can only jump to a label of an enclosing iteration statement
//!    ,----
//!  1 | continue;
//!    : ^^^^^^^^^
//!    `----
