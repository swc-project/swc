//// [renderer.d.ts]
export { };
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
//!  4 | <><span></span></>
//!    :  ^
//!    `----
//! 
//!   x Unexpected token `regexp literal (span><, )`. Expected an identifier, void, yield, null, await, break, a string literal, a numeric literal, true, false, `, -, import, this, typeof, {, [, (
//!    ,----
//!  4 | <><span></span></>
//!    :          ^^^^^^^^
//!    `----
//// [preacty-only-fragment.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  6 | <></>
//!    :  ^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  6 | <></>
//!    :    ^^
//!    `----
//// [snabbdomy-only-fragment.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  4 | <></>
//!    :  ^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  4 | <></>
//!    :    ^^
//!    `----
//// [preacty-only-fragment-no-jsx.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  6 | <></>
//!    :  ^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  6 | <></>
//!    :    ^^
//!    `----
//// [snabbdomy-only-fragment-no-jsx.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  4 | <></>
//!    :  ^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  4 | <></>
//!    :    ^^
//!    `----
//// [preacty-no-fragment.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  6 | <div></div>
//!    :            ^
//!    `----
//// [snabbdomy-no-fragment.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  4 | <div></div>
//!    :            ^
//!    `----
//// [preacty-only-component.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  6 | <Component />
//!    :            ^
//!    `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  6 | <Component />
//!    :             ^
//!    `----
