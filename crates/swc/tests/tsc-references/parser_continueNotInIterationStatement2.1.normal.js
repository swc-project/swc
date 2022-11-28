//// [parser_continueNotInIterationStatement2.ts]
//! 
//!   x A 'continue' statement can only jump to a label of an enclosing iteration statement
//!    ,-[1:1]
//!  1 | while (true) {
//!  2 |   function f() {
//!  3 |     continue;
//!    :     ^^^^^^^^^
//!  4 |   }
//!  5 | }
//!    `----
