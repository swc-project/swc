//// [parser_breakNotInIterationOrSwitchStatement2.ts]
//! 
//!   x A 'break' statement can only be used within an enclosing iteration or switch statement
//!    ,-[1:1]
//!  1 | while (true) {
//!  2 |   function f() {
//!  3 |     break;
//!    :     ^^^^^^
//!  4 |   }
//!  5 | }
//!    `----
