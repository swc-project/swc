//// [FunctionDeclaration3_es6.ts]
//! 
//!   x `yield` cannot be used as an identifier in strict mode
//!    ,----
//!  1 | function f(yield = yield) {
//!    :            ^^^^^
//!    `----
//! 
//!   x Unexpected token `yield`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp,
//!   | ` for template literal, (, or an identifier
//!    ,----
//!  1 | function f(yield = yield) {
//!    :                    ^^^^^
//!    `----
