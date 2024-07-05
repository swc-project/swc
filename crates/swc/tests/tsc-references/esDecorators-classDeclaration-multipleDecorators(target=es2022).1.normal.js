//// [esDecorators-classDeclaration-multipleDecorators.ts]
//!   x Expression expected
//!    ,-[4:1]
//!  1 | 
//!  2 | declare let dec1: any, dec2: any;
//!  3 | 
//!  4 | @dec1
//!    : ^
//!  5 | @dec2
//!  6 | class C {
//!  7 | }
//!    `----
