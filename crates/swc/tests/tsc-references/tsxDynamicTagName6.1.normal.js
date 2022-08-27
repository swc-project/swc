//// [tsxDynamicTagName6.tsx]
//! 
//!   x Expression expected
//!     ,----
//!  10 | const foo = <t.tag/>  // No error
//!     :                   ^
//!     `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!     ,----
//!  10 | const foo = <t.tag/>  // No error
//!     :                    ^
//!     `----
