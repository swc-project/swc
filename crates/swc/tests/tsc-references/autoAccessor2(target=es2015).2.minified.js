//// [autoAccessor2.ts]
//! 
//!   x Unexpected token `#`. Expected * for generator, private key, identifier or async
//!    ,-[1:1]
//!  1 | 
//!  2 | class C1 {
//!  3 |     accessor #a: any;
//!    :              ^
//!  4 |     accessor #b = 1;
//!  5 |     static accessor #c: any;
//!  6 |     static accessor #d = 2;
//!    `----
