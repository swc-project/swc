//// [jsxParsingError3.tsx]
//// [file.tsx]
//// [Error1.tsx]
//! 
//!   x Unexpected token `}`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  1 | let x1 = <div>}</div>;
//!    :               ^
//!    `----
//// [Error2.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  1 | let x2 = <div>></div>;
//!    :               ^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  1 | let x2 = <div>></div>;
//!    :                 ^^^^^^
//!    `----
//// [Error3.tsx]
//! 
//!   x Expected a semicolon
//!    ,----
//!  1 | let x3 = <div>{"foo"}}</div>;
//!    :                     ^
//!    `----
//! 
//!   x Unexpected token `}`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  1 | let x3 = <div>{"foo"}}</div>;
//!    :                      ^
//!    `----
//// [Error4.tsx]
//! 
//!   x Expected a semicolon
//!    ,----
//!  1 | let x4 = <div>{"foo"}></div>;
//!    :                     ^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  1 | let x4 = <div>{"foo"}></div>;
//!    :                        ^^^^^^
//!    `----
//// [Error5.tsx]
//! 
//!   x Unexpected token `}`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  1 | let x5 = <div>}{"foo"}</div>;
//!    :               ^
//!    `----
//// [Error6.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  1 | let x6 = <div>>{"foo"}</div>;
//!    :               ^
//!    `----
//! 
//!   x Expected a semicolon
//!    ,----
//!  1 | let x6 = <div>>{"foo"}</div>;
//!    :                      ^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  1 | let x6 = <div>>{"foo"}</div>;
//!    :                        ^^^^^^
//!    `----
