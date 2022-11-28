//// [await_unaryExpression_es6_2.ts]
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,-[1:1]
//!  1 | 
//!  2 | async function bar1() {
//!  3 |     delete await 42;
//!    :            ^^^^^^^^
//!  4 | }
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,-[5:1]
//!  5 | 
//!  6 | async function bar2() {
//!  7 |     delete await 42;
//!    :            ^^^^^^^^
//!  8 | }
//!    `----
