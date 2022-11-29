//// [readonlyInConstructorParameters.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[4:1]
//!   4 | new C(1).x = 2;
//!   5 | 
//!   6 | class E {
//!   7 |     constructor(readonly public x: number) {}
//!     :                          ^^^^^^^^^^^^^^^^
//!   8 | }
//!   9 | 
//!  10 | class F {
//!     `----
