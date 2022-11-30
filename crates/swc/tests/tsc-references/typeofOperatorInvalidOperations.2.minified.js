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
//!   x Expression expected
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
//!   x Expression expected
//!    ,-[4:1]
//!  4 | var ANY = ANY typeof ;    //expect error
//!  5 | 
//!  6 | // miss an operand
//!  7 | var ANY1 = typeof ;
//!    :                   ^
//!    `----
