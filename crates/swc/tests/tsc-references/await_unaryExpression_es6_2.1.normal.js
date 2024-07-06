//// [await_unaryExpression_es6_2.ts]
//!   x The operand of a delete operator must be a property reference.
//!    ,-[3:1]
//!  1 | 
//!  2 | async function bar1() {
//!  3 |     delete await 42;
//!    :            ^^^^^^^^
//!  4 | }
//!  5 | 
//!  6 | async function bar2() {
//!    `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[7:1]
//!   4 | }
//!   5 | 
//!   6 | async function bar2() {
//!   7 |     delete await 42;
//!     :            ^^^^^^^^
//!   8 | }
//!   9 | 
//!  10 | async function bar3() {
//!     `----
