//// [typeofOperatorInvalidOperations.ts]
//! 
//!   x Expected a semicolon
//!    ,-[1:1]
//!  1 | // Unary operator typeof
//!  2 | 
//!  3 | // opreand before typeof
//!  4 | var ANY = ANY typeof ;    //expect error
//!    :               ^^^^^^
//!  5 | 
//!  6 | // miss an operand
//!  7 | var ANY1 = typeof ;
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,-[1:1]
//!  1 | // Unary operator typeof
//!  2 | 
//!  3 | // opreand before typeof
//!  4 | var ANY = ANY typeof ;    //expect error
//!    :                      ^
//!  5 | 
//!  6 | // miss an operand
//!  7 | var ANY1 = typeof ;
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,-[4:1]
//!  4 | var ANY = ANY typeof ;    //expect error
//!  5 | 
//!  6 | // miss an operand
//!  7 | var ANY1 = typeof ;
//!    :                   ^
//!    `----
