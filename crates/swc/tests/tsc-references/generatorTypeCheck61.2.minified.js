//// [generatorTypeCheck61.ts]
//! 
//!   x Unexpected token `@`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,-[1:1]
//!  1 | function * g() {
//!  2 |     @(yield 0)
//!    :     ^
//!  3 |     class C {};
//!  4 | }
//!    `----
