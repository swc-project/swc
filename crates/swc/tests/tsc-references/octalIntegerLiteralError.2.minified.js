//// [octalIntegerLiteralError.ts]
//! 
//!   x Expected a semicolon
//!    ,-[1:1]
//!  1 | // error
//!  2 | var oct1 = 0O13334823;
//!    :                   ^^^
//!  3 | var oct2 = 0o34318592;
//!  4 | 
//!  5 | var obj1 = {
//!    `----
//! 
//!   x Expected a semicolon
//!    ,-[1:1]
//!  1 | // error
//!  2 | var oct1 = 0O13334823;
//!  3 | var oct2 = 0o34318592;
//!    :                  ^^^^
//!  4 | 
//!  5 | var obj1 = {
//!  6 |     0O45436: "hi",
//!    `----
