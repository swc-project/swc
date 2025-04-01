//// [esDecorators-classDeclaration-methods-staticPrivate.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!    ,-[5:1]
//!  2 | declare let dec: any;
//!  3 | 
//!  4 | class C {
//!  5 |     @dec static #method1() {}
//!    :     ^
//!  6 | }
//!  7 | 
//!  8 | @dec
//!    `----
