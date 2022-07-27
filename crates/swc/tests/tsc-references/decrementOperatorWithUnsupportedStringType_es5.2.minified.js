//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 25 | var ResultIsNumber5 = --"";
//!    :                         ^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 26 | var ResultIsNumber6 = --{ x: "", y: "" };
//!    :                         ^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 27 | var ResultIsNumber7 = --{ x: "", y: (s: string) => { return s; } };
//!    :                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 29 | var ResultIsNumber8 = ""--;
//!    :                       ^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 30 | var ResultIsNumber9 = { x: "", y: "" }--;
//!    :                       ^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 31 | var ResultIsNumber10 = { x: "", y: (s: string) => { return s; } }--;
//!    :                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 37 | var ResultIsNumber14 = --foo();
//!    :                          ^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 38 | var ResultIsNumber15 = --A.foo();
//!    :                          ^^^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 39 | var ResultIsNumber16 = --(STRING + STRING);
//!    :                          ^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 44 | var ResultIsNumber20 = foo()--;
//!    :                        ^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 45 | var ResultIsNumber21 = A.foo()--;
//!    :                        ^^^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 46 | var ResultIsNumber22 = (STRING + STRING)--;
//!    :                        ^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 49 | --"";
//!    :   ^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 53 | --foo();
//!    :   ^^^^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 58 | ""--;
//!    : ^^
//!    `----
//!
//!  x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//! 62 | foo()--;
//!    : ^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
