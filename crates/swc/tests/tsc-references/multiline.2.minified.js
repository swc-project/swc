//// [a.ts]
export var texts = [];
texts.push(100), texts.push(100), texts.push("100");
//// [b.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  4 | return <div />;
//!    :             ^
//!    `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  4 | return <div />;
//!    :              ^
//!    `----
