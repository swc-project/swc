//// [parserClassDeclaration4.ts]
//! 
//!   x 'extends' clause must precede 'implements' clause.
//!    ,-[1:1]
//!  1 | class C extends A implements B extends C {
//!    :                                ^^^^^^^
//!  2 | }
//!    `----
