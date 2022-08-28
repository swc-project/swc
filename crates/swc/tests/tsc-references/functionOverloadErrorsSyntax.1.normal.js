//// [functionOverloadErrorsSyntax.ts]
//! 
//!   x A rest parameter must be last in a parameter list
//!    ,----
//!  9 | function fn5(x: string, ...y: any[], z: string);
//!    :                         ^^^^^^^^^^^
//!    `----
