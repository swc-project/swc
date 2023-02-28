//// [autoAccessorAllowedModifiers.ts]
//! 
//!   x Unexpected token `a`. Expected * for generator, private key, identifier or async
//!    ,-[1:1]
//!  1 | 
//!  2 | abstract class C1 {
//!  3 |     accessor a: any;
//!    :              ^
//!  4 |     public accessor b: any;
//!  5 |     private accessor c: any;
//!  6 |     protected accessor d: any;
//!    `----
