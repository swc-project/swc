//// [readonlyInConstructorParameters.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  7 | constructor(readonly public x: number) {}
//!    :                      ^^^^^^^^^^^^^^^^
//!    `----
