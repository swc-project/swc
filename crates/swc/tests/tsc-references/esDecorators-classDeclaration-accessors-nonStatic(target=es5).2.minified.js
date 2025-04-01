//// [esDecorators-classDeclaration-accessors-nonStatic.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!     ,-[7:1]
//!   4 | const method3 = "method3";
//!   5 | 
//!   6 | class C {
//!   7 |     @dec(11) get method1() { return 0; }
//!     :     ^
//!   8 |     @dec(12) set method1(value) {}
//!   9 |     @dec(21) get ["method2"]() { return 0; }
//!  10 |     @dec(22) set ["method2"](value) {}
//!     `----
