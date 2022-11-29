//// [parser_continueNotInIterationStatement3.ts]
//! 
//!   x A 'continue' statement can only jump to a label of an enclosing iteration statement
//!    ,-[1:1]
//!  1 | switch (0) {
//!  2 |   default:
//!  3 |     continue;
//!    :     ^^^^^^^^^
//!  4 | }
//!    `----
