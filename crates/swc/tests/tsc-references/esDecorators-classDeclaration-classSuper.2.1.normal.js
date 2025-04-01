//// [esDecorators-classDeclaration-classSuper.2.ts]
//!   x Expression expected
//!    ,-[5:1]
//!  2 | declare var dec: any;
//!  3 | 
//!  4 | // class expression in extends should not get an assigned name
//!  5 | @dec
//!    : ^
//!  6 | class C1 extends class { } {
//!  7 |     static {
//!  8 |         super.name;
//!    `----
