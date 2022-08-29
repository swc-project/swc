//// [incrementOperatorWithNumberTypeInvalidOperations.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  22 | var ResultIsNumber3 = ++1;
//!     :                         ^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  23 | var ResultIsNumber4 = ++{ x: 1, y: 2};
//!     :                         ^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  24 | var ResultIsNumber5 = ++{ x: 1, y: (n: number) => { return n; } };
//!     :                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  26 | var ResultIsNumber6 = 1++;
//!     :                       ^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  27 | var ResultIsNumber7 = { x: 1, y: 2 }++;
//!     :                       ^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  28 | var ResultIsNumber8 = { x: 1, y: (n: number) => { return n; } }++;
//!     :                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  31 | var ResultIsNumber9 = ++foo();
//!     :                         ^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  32 | var ResultIsNumber10 = ++A.foo();
//!     :                          ^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  33 | var ResultIsNumber11 = ++(NUMBER + NUMBER);
//!     :                          ^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  35 | var ResultIsNumber12 = foo()++;
//!     :                        ^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  36 | var ResultIsNumber13 = A.foo()++;
//!     :                        ^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  37 | var ResultIsNumber14 = (NUMBER + NUMBER)++;
//!     :                        ^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  40 | ++1;
//!     :   ^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  42 | ++foo();
//!     :   ^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  44 | 1++;
//!     : ^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  46 | foo()++;
//!     : ^^^^^
//!     `----
