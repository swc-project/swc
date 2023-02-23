//// [autoAccessor9.ts]
//! 
//!   x Unexpected token `x`. Expected * for generator, private key, identifier or async
//!    ,-[2:1]
//!  2 | // Auto-accessors do not use Set semantics themselves, so do not need to be transformed if there are no other
//!  3 | // initializers that need to be transformed:
//!  4 | class C1 {
//!  5 |     accessor x = 1;
//!    :              ^
//!  6 | }
//!  7 | 
//!  8 | // If there are other field initializers to transform, we must transform auto-accessors so that we can preserve
//!    `----
