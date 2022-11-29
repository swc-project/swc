//// [voidOperatorInvalidOperations.ts]
//! 
//!   x Expected a semicolon
//!    ,-[1:1]
//!  1 | // Unary operator void
//!  2 | 
//!  3 | // operand before void
//!  4 | var ANY = ANY void ;    //expect error
//!    :               ^^^^
//!  5 | 
//!  6 | // miss an operand
//!  7 | var ANY1 = void ;
//!    `----
//! 
//!   x Expression expected
//!    ,-[1:1]
//!  1 | // Unary operator void
//!  2 | 
//!  3 | // operand before void
//!  4 | var ANY = ANY void ;    //expect error
//!    :                    ^
//!  5 | 
//!  6 | // miss an operand
//!  7 | var ANY1 = void ;
//!    `----
//! 
//!   x Expression expected
//!    ,-[4:1]
//!  4 | var ANY = ANY void ;    //expect error
//!  5 | 
//!  6 | // miss an operand
//!  7 | var ANY1 = void ;
//!    :                 ^
//!    `----
