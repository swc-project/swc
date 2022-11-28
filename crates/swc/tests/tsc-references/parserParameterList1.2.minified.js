//// [parserParameterList1.ts]
//! 
//!   x A rest parameter must be last in a parameter list
//!    ,-[1:1]
//!  1 | class C {
//!  2 |    F(...A, B) { }
//!    :      ^^^^
//!  3 | }
//!    `----
