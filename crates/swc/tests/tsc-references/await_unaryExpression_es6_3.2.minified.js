//// [await_unaryExpression_es6_3.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,-[1:1]
//!  1 | 
//!  2 | async function bar1() {
//!  3 |     ++await 42; // Error
//!    :       ^^^^^^^^
//!  4 | }
//!  5 | 
//!  6 | async function bar2() {
//!    `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[4:1]
//!   4 | }
//!   5 | 
//!   6 | async function bar2() {
//!   7 |     --await 42; // Error
//!     :       ^^^^^^^^
//!   8 | }
//!   9 | 
//!  10 | async function bar3() {
//!     `----
