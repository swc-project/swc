//// [parserParameterList6.ts]
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[2:1]
//!  1 | class C {
//!  2 |   constructor(C: (public A) => any) {
//!    :                   ^^^^^^^^
//!  3 |   }
//!  4 | }
//!    `----
