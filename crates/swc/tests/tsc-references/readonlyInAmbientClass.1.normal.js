//// [readonlyInAmbientClass.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  2 | constructor(readonly x: number);
//!    :             ^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  3 | method(readonly x: number);
//!    :        ^^^^^^^^^^^^^^^^^^
//!    `----
