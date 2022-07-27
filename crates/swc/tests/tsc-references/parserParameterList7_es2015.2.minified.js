//!
//!  x A parameter property is only allowed in a constructor implementation
//!   ,----
//! 2 | constructor(public p1:string); // ERROR
//!   :             ^^^^^^^^^^^^^^^^
//!   `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!   ,----
//! 3 | constructor(private p2:number); // ERROR
//!   :             ^^^^^^^^^^^^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
