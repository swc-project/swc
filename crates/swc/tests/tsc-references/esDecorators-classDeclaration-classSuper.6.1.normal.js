//// [esDecorators-classDeclaration-classSuper.6.ts]
//!   x Expression expected
//!     ,-[10:1]
//!   7 | }
//!   8 | 
//!   9 | // none of the following should result in caching `super`
//!  10 | @dec
//!     : ^
//!  11 | class C extends Base {
//!  12 |     static m() { super.method(); }
//!  13 |     static get x() { return super.method(); }
//!     `----
