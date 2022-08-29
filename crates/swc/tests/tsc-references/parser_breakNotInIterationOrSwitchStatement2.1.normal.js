//// [parser_breakNotInIterationOrSwitchStatement2.ts]
//! 
//!   x A 'break' statement can only be used within an enclosing iteration or switch statement
//!    ,----
//!  3 | break;
//!    : ^^^^^^
//!    `----
