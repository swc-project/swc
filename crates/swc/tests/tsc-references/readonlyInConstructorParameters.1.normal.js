//// [readonlyInConstructorParameters.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[5:1]
//!  5 | 
//!  6 | class E {
//!  7 |     constructor(readonly public x: number) {}
//!    :                          ^^^^^^^^^^^^^^^^
//!  8 | }
//!    `----
