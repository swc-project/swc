//// [withStatements.ts]
//! 
//!   x The 'with' statement is not supported. All symbols in a 'with' block will have type 'any'.
//!    ,----
//!  2 | with (x) {
//!    : ^^^^
//!    `----
//! 
//!   x With statement are not allowed in strict mode
//!    ,----
//!  2 | with (x) {
//!    : ^^^^
//!    `----
