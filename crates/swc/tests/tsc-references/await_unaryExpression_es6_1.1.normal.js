//// [await_unaryExpression_es6_1.ts]
//!   x The operand of a delete operator must be a property reference.
//!     ,-[7:1]
//!   4 | }
//!   5 | 
//!   6 | async function bar1() {
//!   7 |     delete await 42; // OK
//!     :            ^^^^^^^^
//!   8 | }
//!   9 | 
//!  10 | async function bar2() {
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[11:1]
//!   8 | }
//!   9 | 
//!  10 | async function bar2() {
//!  11 |     delete await 42; // OK
//!     :            ^^^^^^^^
//!  12 | }
//!  13 | 
//!  14 | async function bar3() {
//!     `----
