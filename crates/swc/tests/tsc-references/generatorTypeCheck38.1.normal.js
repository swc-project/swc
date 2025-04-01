//// [generatorTypeCheck38.ts]
//!   x `yield` cannot be used as an identifier in strict mode
//!    ,-[1:1]
//!  1 | var yield;
//!    :     ^^^^^
//!  2 | function* g() {
//!  3 |     yield 0;
//!  4 |     var v: typeof yield;
//!    `----
