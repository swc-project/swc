//// [esDecorators-classDeclaration-accessors-staticPrivate.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!    ,-[5:1]
//!  2 | declare let dec: any;
//!  3 | 
//!  4 | class C {
//!  5 |     @dec(1) static get #method1() { return 0; }
//!    :     ^
//!  6 |     @dec(2) static set #method1(value) {}
//!  7 | }
//!    `----
