//// [parser_breakNotInIterationOrSwitchStatement1.ts]
//! 
//!   x A 'break' statement can only be used within an enclosing iteration or switch statement
//!    ,----
//!  1 | break;
//!    : ^^^^^^
//!    `----
