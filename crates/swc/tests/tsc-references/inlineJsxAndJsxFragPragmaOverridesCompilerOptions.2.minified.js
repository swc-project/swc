//// [inlineJsxAndJsxFragPragmaOverridesCompilerOptions.tsx]
//// [react.d.ts]
export { };
//// [preact.d.ts]
export { };
//// [snabbdom.d.ts]
export { };
//// [reacty.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  2 | <><span></span></>
//!    :  ^
//!    `----
//! 
//!   x Unexpected token `regexp literal (span><, )`. Expected an identifier, void, yield, null, await, break, a string literal, a numeric literal, true, false, `, -, import, this, typeof, {, [, (
//!    ,----
//!  2 | <><span></span></>
//!    :          ^^^^^^^^
//!    `----
//// [preacty.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  6 | <><div></div></>
//!    :  ^
//!    `----
//! 
//!   x Unexpected token `regexp literal (div><, )`. Expected an identifier, void, yield, null, await, break, a string literal, a numeric literal, true, false, `, -, import, this, typeof, {, [, (
//!    ,----
//!  6 | <><div></div></>
//!    :         ^^^^^^^
//!    `----
//// [snabbdomy.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  6 | <><div></div></>
//!    :  ^
//!    `----
//! 
//!   x Unexpected token `regexp literal (div><, )`. Expected an identifier, void, yield, null, await, break, a string literal, a numeric literal, true, false, `, -, import, this, typeof, {, [, (
//!    ,----
//!  6 | <><div></div></>
//!    :         ^^^^^^^
//!    `----
//// [mix-n-match.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  5 | <><span></span></>
//!    :  ^
//!    `----
//! 
//!   x Unexpected token `regexp literal (span><, )`. Expected an identifier, void, yield, null, await, break, a string literal, a numeric literal, true, false, `, -, import, this, typeof, {, [, (
//!    ,----
//!  5 | <><span></span></>
//!    :          ^^^^^^^^
//!    `----
