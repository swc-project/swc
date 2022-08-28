//// [parseClassDeclarationInStrictModeByDefaultInES6.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,----
//!  4 | public foo(arguments: any) { }
//!    :            ^^^^^^^^^
//!    `----
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,----
//!  5 | private bar(eval:any) {
//!    :             ^^^^
//!    `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//!  6 | arguments = "hello";
//!    : ^^^^^^^^^
//!    `----
//! 
//!   x Invalid use of 'arguments' in strict mode
//!    ,----
//!  6 | arguments = "hello";
//!    : ^^^^^^^^^
//!    `----
