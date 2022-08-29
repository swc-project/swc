//// [parserStrictMode3.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//!  2 | eval = 1;
//!    : ^^^^
//!    `----
//! 
//!   x Invalid use of 'arguments' in strict mode
//!    ,----
//!  2 | eval = 1;
//!    : ^^^^
//!    `----
