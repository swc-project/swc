//// [classWithTwoConstructorDefinitions.ts]
//! 
//!   x A class can only have one constructor
//!    ,----
//!  3 | constructor(x) { } // error
//!    : ^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x A class can only have one constructor
//!    ,----
//!  8 | constructor(x: T, y: T) { } // error
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
