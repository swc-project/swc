//// [binaryIntegerLiteralError.ts]
//! 
//!   x Expected a semicolon
//!    ,-[1:1]
//!  1 | // error
//!  2 | var bin1 = 0B1102110;
//!    :                 ^^^^
//!  3 | var bin1 = 0b11023410;
//!  4 | 
//!  5 | var obj1 = {
//!    `----
//! 
//!   x Expected a semicolon
//!    ,-[1:1]
//!  1 | // error
//!  2 | var bin1 = 0B1102110;
//!  3 | var bin1 = 0b11023410;
//!    :                 ^^^^^
//!  4 | 
//!  5 | var obj1 = {
//!  6 |     0b11010: "hi",
//!    `----
