//// [esDecorators-classDeclaration-classSuper.4.ts]
//!   x Expression expected
//!     ,-[10:1]
//!   7 | 
//!   8 | const method = "method";
//!   9 | 
//!  10 | @dec
//!     : ^
//!  11 | class C extends Base {
//!  12 |     static a = super.method();
//!  13 |     static b = super["method"]();
//!     `----
