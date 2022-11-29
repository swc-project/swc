//// [parserAccessors5.ts]
//! 
//!   x An implementation cannot be declared in ambient contexts
//!    ,-[1:1]
//!  1 | declare class C {
//!  2 |   get foo() { return 0; }
//!    :             ^
//!  3 | }
//!    `----
