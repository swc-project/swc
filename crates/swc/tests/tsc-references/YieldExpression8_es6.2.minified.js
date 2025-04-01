//// [YieldExpression8_es6.ts]
//!   x Expression expected
//!    ,-[1:1]
//!  1 | yield(foo);
//!    : ^^^^^
//!  2 | function* foo() {
//!  3 |   yield(foo);
//!  4 | }
//!    `----
