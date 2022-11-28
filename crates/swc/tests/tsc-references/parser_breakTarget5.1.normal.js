//// [parser_breakTarget5.ts]
//! 
//!   x A 'break' statement can only jump to a label of an enclosing statement
//!    ,-[2:1]
//!  2 | while (true) {
//!  3 |   function f() {
//!  4 |     while (true) {
//!  5 |       break target;
//!    :       ^^^^^^^^^^^^^
//!  6 |     }
//!  7 |   }
//!  8 | }
//!    `----
