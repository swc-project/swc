//// [esDecorators-preservesThis.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!     ,-[11:1]
//!   8 | 
//!   9 | // preserve `this` for access
//!  10 | class C {
//!  11 |     @instance.decorate
//!     :     ^
//!  12 |     method1() { }
//!  13 | 
//!  14 |     @(instance["decorate"])
//!     `----
