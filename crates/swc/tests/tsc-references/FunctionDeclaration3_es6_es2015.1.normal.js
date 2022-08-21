//!
//!  x `yield` cannot be used as an identifier in strict mode
//!   ,----
//! 2 | function f(yield = yield) {
//!   :            ^^^^^
//!   `----
//!
//!  x Unexpected token `yield`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp,
//!  | ` for template literal, (, or an identifier
//!   ,----
//! 2 | function f(yield = yield) {
//!   :                    ^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: Syntax Error
