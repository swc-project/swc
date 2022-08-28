//// [incrementOperatorWithAnyOtherTypeInvalidOperations.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  37 | var ResultIsNumber11 = ++{};
//!     :                          ^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  38 | var ResultIsNumber12 = ++null;
//!     :                          ^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  41 | var ResultIsNumber14 = null++;
//!     :                        ^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  42 | var ResultIsNumber15 = {}++;
//!     :                        ^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  46 | var ResultIsNumber17 = ++foo();
//!     :                          ^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  47 | var ResultIsNumber18 = ++A.foo();
//!     :                          ^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  48 | var ResultIsNumber19 = ++(null + undefined);
//!     :                          ^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  49 | var ResultIsNumber20 = ++(null + null);
//!     :                          ^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  50 | var ResultIsNumber21 = ++(undefined + undefined);
//!     :                          ^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  54 | var ResultIsNumber24 = foo()++;
//!     :                        ^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  55 | var ResultIsNumber25 = A.foo()++;
//!     :                        ^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  56 | var ResultIsNumber26 = (null + undefined)++;
//!     :                        ^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  57 | var ResultIsNumber27 = (null + null)++;
//!     :                        ^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  58 | var ResultIsNumber28 = (undefined + undefined)++;
//!     :                        ^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  67 | ++ANY1++;
//!     :   ^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  68 | ++ANY2++;
//!     :   ^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  69 | ++ANY2[0]++;
//!     :   ^^^^^^^^^
//!     `----
