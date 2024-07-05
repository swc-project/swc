//// [esDecorators-classExpression-classSuper.1.ts]
//!   x Expression expected
//!     ,-[10:1]
//!   7 | 
//!   8 | const method = "method";
//!   9 | 
//!  10 | (@dec
//!     :  ^
//!  11 | class C extends Base {
//!  12 |     static {
//!  13 |         super.method();
//!     `----
