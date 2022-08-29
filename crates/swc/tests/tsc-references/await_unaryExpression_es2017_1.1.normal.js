//// [await_unaryExpression_es2017_1.ts]
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  7 | delete await 42; // OK
//!    :        ^^^^^^^^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  11 | delete await 42; // OK
//!     :        ^^^^^^^^
//!     `----
