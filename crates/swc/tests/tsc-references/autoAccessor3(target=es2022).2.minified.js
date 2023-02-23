//// [autoAccessor3.ts]
//! 
//!   x Unexpected token `string literal (w, "w")`. Expected * for generator, private key, identifier or async
//!    ,-[1:1]
//!  1 | 
//!  2 | class C1 {
//!  3 |     accessor "w": any;
//!    :              ^^^
//!  4 |     accessor "x" = 1;
//!  5 |     static accessor "y": any;
//!  6 |     static accessor "z" = 2;
//!    `----
