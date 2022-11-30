//// [generatorTypeCheck39.ts]
//! 
//!   x Expression expected
//!    ,-[2:1]
//!  2 |     return y => { };
//!  3 | }
//!  4 | function* g() {
//!  5 |     @decorator(yield 0)
//!    :     ^
//!  6 |     class C {
//!  7 |         x = yield 0;
//!  8 |     }
//!    `----
