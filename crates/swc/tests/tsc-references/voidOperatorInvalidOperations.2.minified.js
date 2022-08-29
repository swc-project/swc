//// [voidOperatorInvalidOperations.ts]
//! 
//!   x Expected a semicolon
//!    ,----
//!  4 | var ANY = ANY void ;    //expect error
//!    :               ^^^^
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  4 | var ANY = ANY void ;    //expect error
//!    :                    ^
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  7 | var ANY1 = void ;
//!    :                 ^
//!    `----
