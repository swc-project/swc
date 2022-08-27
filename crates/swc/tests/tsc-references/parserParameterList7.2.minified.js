//// [parserParameterList7.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  2 | constructor(public p1:string); // ERROR
//!    :             ^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  3 | constructor(private p2:number); // ERROR
//!    :             ^^^^^^^^^^^^^^^^^
//!    `----
