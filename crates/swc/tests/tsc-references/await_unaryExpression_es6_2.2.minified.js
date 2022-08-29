//// [await_unaryExpression_es6_2.ts]
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  3 | delete await 42;
//!    :        ^^^^^^^^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  7 | delete await 42;
//!    :        ^^^^^^^^
//!    `----
