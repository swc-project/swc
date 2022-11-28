//// [parser_continueTarget6.ts]
//! 
//!   x Jump target cannot cross function boundary
//!    ,-[1:1]
//!  1 | while (true) {
//!  2 |   continue target;
//!    :   ^^^^^^^^^^^^^^^^
//!  3 | }
//!    `----
