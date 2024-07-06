//// [esDecorators-classExpression-classSuper.5.ts]
//!   x Expression expected
//!     ,-[10:1]
//!   7 | 
//!   8 | const x = "x";
//!   9 | 
//!  10 | (@dec
//!     :  ^
//!  11 | class C1 extends Base {
//!  12 |     static a = super.x;
//!  13 |     static b = super.x = 1;
//!     `----
