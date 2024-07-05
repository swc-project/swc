//// [esDecorators-classDeclaration-classThisReference.ts]
//!   x Expression expected
//!    ,-[4:1]
//!  1 | 
//!  2 | declare let dec: any;
//!  3 | 
//!  4 | @dec
//!    : ^
//!  5 | class C {
//!  6 |     static { this; }
//!  7 |     static x: any = this;
//!    `----
