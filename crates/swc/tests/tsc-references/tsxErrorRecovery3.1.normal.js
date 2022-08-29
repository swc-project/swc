//// [tsxErrorRecovery3.tsx]
//// [file1.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  4 | <div></div>
//!    : ^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  4 | <div></div>
//!    :       ^^^^^
//!    `----
//// [file2.tsx]
//! 
//!   x Unexpected token `regexp literal (div><div><, div)`. Expected an identifier, void, yield, null, await, break, a string literal, a numeric literal, true, false, `, -, import, this, typeof, {,
//!   | [, (
//!    ,----
//!  1 | var x = <div></div><div></div>
//!    :               ^^^^^^^^^^^^^^^
//!    `----
