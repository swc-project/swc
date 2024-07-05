//// [parserGreaterThanTokenAmbiguity11.ts]
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//!  1 | 1 >>= 2;
//!    : ^
//!    `----
//!   x Invalid assignment target
//!    ,----
//!  1 | 1 >>= 2;
//!    : ^
//!    `----
