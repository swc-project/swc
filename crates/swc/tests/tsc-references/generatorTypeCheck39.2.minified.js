//// [generatorTypeCheck39.ts]
//! 
//!   x Unexpected token `@`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,-[3:1]
//!  3 | }
//!  4 | function* g() {
//!  5 |     @decorator(yield 0)
//!    :     ^
//!  6 |     class C {
//!  7 |         x = yield 0;
//!    `----
