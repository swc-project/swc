//// [withStatements.ts]
//! 
//!   x The 'with' statement is not supported. All symbols in a 'with' block will have type 'any'.
//!    ,-[1:1]
//!  1 | var x = 12;
//!  2 | with (x) {
//!    : ^^^^
//!  3 |     name = 'twelve'
//!  4 |     id = 12
//!    `----
//! 
//!   x With statement are not allowed in strict mode
//!    ,-[1:1]
//!  1 | var x = 12;
//!  2 | with (x) {
//!    : ^^^^
//!  3 |     name = 'twelve'
//!  4 |     id = 12
//!    `----
