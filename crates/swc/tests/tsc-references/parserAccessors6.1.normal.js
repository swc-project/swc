//// [parserAccessors6.ts]
//! 
//!   x An implementation cannot be declared in ambient contexts
//!    ,-[1:1]
//!  1 | declare class C {
//!  2 |   set foo(v) { }
//!    :              ^
//!  3 | }
//!    `----
