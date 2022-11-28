//// [parserModuleDeclaration5.ts]
//! 
//!   x `declare` modifier not allowed for code already in an ambient context
//!    ,-[1:1]
//!  1 | module M1 {
//!  2 |   declare module M2 {
//!  3 |     declare module M3 {
//!    :     ^^^^^^^
//!  4 |     }
//!  5 |   }
//!    `----
