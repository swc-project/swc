//// [nullishCoalescingOperator5.ts]
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!     ,-[7:1]
//!   4 | declare const c: string | undefined
//!   5 | 
//!   6 | // should be a syntax error
//!   7 | a ?? b || c;
//!     : ^^^^^^^^^^^
//!   8 | 
//!   9 | // should be a syntax error
//!  10 | a || b ?? c;
//!     `----
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!     ,-[10:1]
//!   7 | a ?? b || c;
//!   8 | 
//!   9 | // should be a syntax error
//!  10 | a || b ?? c;
//!     : ^^^^^^
//!  11 | 
//!  12 | // should be a syntax error
//!  13 | a ?? b && c;
//!     `----
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!     ,-[13:1]
//!  10 | a || b ?? c;
//!  11 | 
//!  12 | // should be a syntax error
//!  13 | a ?? b && c;
//!     :      ^^^^^^
//!  14 | 
//!  15 | // should be a syntax error
//!  16 | a && b ?? c;
//!     `----
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!     ,-[16:1]
//!  13 | a ?? b && c;
//!  14 | 
//!  15 | // should be a syntax error
//!  16 | a && b ?? c;
//!     : ^^^^^^
//!  17 | 
//!  18 | // Valid according to spec
//!  19 | a ?? (b || c);
//!     `----
