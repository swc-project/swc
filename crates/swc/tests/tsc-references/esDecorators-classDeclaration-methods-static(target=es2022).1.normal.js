//// [esDecorators-classDeclaration-methods-static.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!     ,-[7:1]
//!   4 | const method3 = "method3";
//!   5 | 
//!   6 | class C {
//!   7 |     @dec(1) static method1() {}
//!     :     ^
//!   8 |     @dec(2) static ["method2"]() {}
//!   9 |     @dec(3) static [method3]() {}
//!  10 | }
//!     `----
