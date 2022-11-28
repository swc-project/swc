//// [parserConstructorDeclaration11.ts]
//! 
//!   x Type parameter list cannot be empty
//!    ,-[1:1]
//!  1 | class C {
//!  2 |   constructor<>() { }
//!    :              ^^
//!  3 | }
//!    `----
//! 
//!   x Type parameters cannot appear on a constructor declaration
//!    ,-[1:1]
//!  1 | class C {
//!  2 |   constructor<>() { }
//!    :               ^
//!  3 | }
//!    `----
