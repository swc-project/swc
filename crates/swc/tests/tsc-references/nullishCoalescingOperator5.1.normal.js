//// [nullishCoalescingOperator5.ts]
//! 
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!    ,-[5:1]
//!  5 | 
//!  6 | // should be a syntax error
//!  7 | a ?? b || c;
//!    : ^^^^^^^^^^^
//!  8 | 
//!  9 | // should be a syntax error
//!    `----
//! 
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!     ,-[8:1]
//!   8 | 
//!   9 | // should be a syntax error
//!  10 | a || b ?? c;
//!     : ^^^^^^
//!  11 | 
//!  12 | // should be a syntax error
//!     `----
//! 
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!     ,-[11:1]
//!  11 | 
//!  12 | // should be a syntax error
//!  13 | a ?? b && c;
//!     :      ^^^^^^
//!  14 | 
//!  15 | // should be a syntax error
//!     `----
//! 
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!     ,-[14:1]
//!  14 | 
//!  15 | // should be a syntax error
//!  16 | a && b ?? c;
//!     : ^^^^^^
//!  17 | 
//!  18 | // Valid according to spec
//!     `----
