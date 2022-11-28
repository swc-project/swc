//// [voidOperatorInvalidOperations.ts]
//! 
//!   x Expected a semicolon
//!    ,-[2:1]
//!  2 | 
//!  3 | // operand before void
//!  4 | var ANY = ANY void ;    //expect error
//!    :               ^^^^
//!  5 | 
//!  6 | // miss an operand
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,-[2:1]
//!  2 | 
//!  3 | // operand before void
//!  4 | var ANY = ANY void ;    //expect error
//!    :                    ^
//!  5 | 
//!  6 | // miss an operand
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,-[5:1]
//!  5 | 
//!  6 | // miss an operand
//!  7 | var ANY1 = void ;
//!    :                 ^
//!    `----
