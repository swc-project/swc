//// [generatorTypeCheck59.ts]
//! 
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!    ,-[1:1]
//!  1 | function* g() {
//!  2 |     class C {
//!  3 |         @(yield "")
//!    :         ^
//!  4 |         m() { }
//!  5 |     };
//!    `----
