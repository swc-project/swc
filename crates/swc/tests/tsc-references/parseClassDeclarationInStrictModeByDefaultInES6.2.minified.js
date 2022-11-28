//// [parseClassDeclarationInStrictModeByDefaultInES6.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[2:1]
//!  2 |     interface = 10;
//!  3 |     public implements() { }
//!  4 |     public foo(arguments: any) { }
//!    :                ^^^^^^^^^
//!  5 |     private bar(eval:any) {
//!  6 |         arguments = "hello";
//!    `----
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[3:1]
//!  3 |     public implements() { }
//!  4 |     public foo(arguments: any) { }
//!  5 |     private bar(eval:any) {
//!    :                 ^^^^
//!  6 |         arguments = "hello";
//!  7 |     }
//!    `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,-[4:1]
//!  4 |     public foo(arguments: any) { }
//!  5 |     private bar(eval:any) {
//!  6 |         arguments = "hello";
//!    :         ^^^^^^^^^
//!  7 |     }
//!  8 | }
//!    `----
//! 
//!   x Invalid use of 'arguments' in strict mode
//!    ,-[4:1]
//!  4 |     public foo(arguments: any) { }
//!  5 |     private bar(eval:any) {
//!  6 |         arguments = "hello";
//!    :         ^^^^^^^^^
//!  7 |     }
//!  8 | }
//!    `----
