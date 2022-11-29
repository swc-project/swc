//// [generatorTypeCheck61.ts]
//! 
//!   x Expression expected
//!    ,-[1:1]
//!  1 | function * g() {
//!  2 |     @(yield 0)
//!    :     ^
//!  3 |     class C {};
//!  4 | }
//!    `----
