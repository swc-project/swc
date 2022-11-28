//// [await_unaryExpression_es6_1.ts]
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,-[5:1]
//!  5 | 
//!  6 | async function bar1() {
//!  7 |     delete await 42; // OK
//!    :            ^^^^^^^^
//!  8 | }
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[9:1]
//!   9 | 
//!  10 | async function bar2() {
//!  11 |     delete await 42; // OK
//!     :            ^^^^^^^^
//!  12 | }
//!     `----
