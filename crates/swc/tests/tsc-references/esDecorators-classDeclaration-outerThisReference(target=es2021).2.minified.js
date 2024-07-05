//// [esDecorators-classDeclaration-outerThisReference.ts]
//!   x Expression expected
//!     ,-[7:1]
//!   4 | declare let f: any;
//!   5 | 
//!   6 | // `this` should point to the outer `this` in both cases.
//!   7 | @dec(this)
//!     : ^
//!   8 | class A {
//!   9 |     @dec(this)
//!  10 |     b = 2;
//!     `----
