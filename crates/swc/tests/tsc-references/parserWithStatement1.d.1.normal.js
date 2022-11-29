//// [parserWithStatement1.d.ts]
//! 
//!   x The 'with' statement is not supported. All symbols in a 'with' block will have type 'any'.
//!    ,-[1:1]
//!  1 | with (foo) {
//!    : ^^^^
//!  2 | }
//!    `----
//! 
//!   x With statement are not allowed in strict mode
//!    ,-[1:1]
//!  1 | with (foo) {
//!    : ^^^^
//!  2 | }
//!    `----
