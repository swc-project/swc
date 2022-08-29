//// [incrementOperatorWithUnsupportedBooleanType.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  22 | var ResultIsNumber3 = ++true;
//!     :                         ^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  23 | var ResultIsNumber4 = ++{ x: true, y: false };
//!     :                         ^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  24 | var ResultIsNumber5 = ++{ x: true, y: (n: boolean) => { return n; } };
//!     :                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  26 | var ResultIsNumber6 = true++;
//!     :                       ^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  27 | var ResultIsNumber7 = { x: true, y: false }++;
//!     :                       ^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  28 | var ResultIsNumber8 = { x: true, y: (n: boolean) => { return n; } }++;
//!     :                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  33 | var ResultIsNumber11 = ++foo();
//!     :                          ^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  34 | var ResultIsNumber12 = ++A.foo();
//!     :                          ^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  36 | var ResultIsNumber13 = foo()++;
//!     :                        ^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  37 | var ResultIsNumber14 = A.foo()++;
//!     :                        ^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  42 | ++true;
//!     :   ^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  44 | ++foo();
//!     :   ^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  49 | true++;
//!     : ^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  51 | foo()++;
//!     : ^^^^^
//!     `----
