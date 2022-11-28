//// [parserS7.9_A5.7_T1.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[15:1]
//!  15 |     x
//!  16 |     ++
//!  17 | ,-> ++
//!  18 | `-> y
//!  19 |     
//!     `----
