//// [esDecorators-classDeclaration-methods-nonStatic.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!     ,-[7:1]
//!   4 | const method3 = "method3";
//!   5 | 
//!   6 | class C {
//!   7 |     @dec(1) method1() {}
//!     :     ^
//!   8 |     @dec(2) ["method2"]() {}
//!   9 |     @dec(3) [method3]() {}
//!  10 | }
//!     `----
