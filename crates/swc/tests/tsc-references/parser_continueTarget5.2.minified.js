//// [parser_continueTarget5.ts]
//! 
//!   x Jump target cannot cross function boundary
//!    ,-[2:1]
//!  2 | while (true) {
//!  3 |   function f() {
//!  4 |     while (true) {
//!  5 |       continue target;
//!    :       ^^^^^^^^^^^^^^^^
//!  6 |     }
//!  7 |   }
//!  8 | }
//!    `----
