//// [await_unaryExpression_es2017_3.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//!  3 | ++await 42; // Error
//!    :   ^^^^^^^^
//!    `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//!  7 | --await 42; // Error
//!    :   ^^^^^^^^
//!    `----
