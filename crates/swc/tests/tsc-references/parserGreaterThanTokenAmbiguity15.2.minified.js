//// [parserGreaterThanTokenAmbiguity15.ts]
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,-[1:1]
//!  1 | 1 
//!    : ^
//!  2 | // before
//!  3 | >>= // after
//!  4 | 2;
//!    `----
//!   x Invalid assignment target
//!    ,-[1:1]
//!  1 | 1 
//!    : ^
//!  2 | // before
//!  3 | >>= // after
//!  4 | 2;
//!    `----
