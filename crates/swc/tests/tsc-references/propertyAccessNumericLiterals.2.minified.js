//// [propertyAccessNumericLiterals.ts]
//! 
//!   x Legacy octal literals are not available when targeting ECMAScript 5 and higher
//!    ,-[3:1]
//!  3 | 0b01101101.toString();
//!  4 | 1234..toString();
//!  5 | 1e0.toString();
//!  6 | 000.toString();
//!    : ^^^
//!  7 | 08.8e5.toString();
//!  8 | 0_8.8e5.toString();
//!  9 | 8.8e5.toString();
//!    `----
//! 
//!   x Legacy octal escape is not permitted in strict mode
//!    ,-[3:1]
//!  3 | 0b01101101.toString();
//!  4 | 1234..toString();
//!  5 | 1e0.toString();
//!  6 | 000.toString();
//!    : ^^^
//!  7 | 08.8e5.toString();
//!  8 | 0_8.8e5.toString();
//!  9 | 8.8e5.toString();
//!    `----
//! 
//!   x Legacy decimal escape is not permitted in strict mode
//!     ,-[4:1]
//!   4 | 1234..toString();
//!   5 | 1e0.toString();
//!   6 | 000.toString();
//!   7 | 08.8e5.toString();
//!     : ^^
//!   8 | 0_8.8e5.toString();
//!   9 | 8.8e5.toString();
//!  10 | 088e4.toString();
//!     `----
//! 
//!   x Legacy decimal escape is not permitted in strict mode
//!     ,-[5:1]
//!   5 | 1e0.toString();
//!   6 | 000.toString();
//!   7 | 08.8e5.toString();
//!   8 | 0_8.8e5.toString();
//!     : ^^^
//!   9 | 8.8e5.toString();
//!  10 | 088e4.toString();
//!  11 | 88_e4.toString();
//!     `----
//! 
//!   x Legacy decimal escape is not permitted in strict mode
//!     ,-[7:1]
//!   7 | 08.8e5.toString();
//!   8 | 0_8.8e5.toString();
//!   9 | 8.8e5.toString();
//!  10 | 088e4.toString();
//!     : ^^^
//!  11 | 88_e4.toString();
//!  12 | 88e4.toString();
//!  13 | 8_8e4.toString();
//!     `----
//! 
//!   x A numeric separator is only allowed between two digits
//!     ,-[8:1]
//!   8 | 0_8.8e5.toString();
//!   9 | 8.8e5.toString();
//!  10 | 088e4.toString();
//!  11 | 88_e4.toString();
//!     : ^^
//!  12 | 88e4.toString();
//!  13 | 8_8e4.toString();
//!     `----
