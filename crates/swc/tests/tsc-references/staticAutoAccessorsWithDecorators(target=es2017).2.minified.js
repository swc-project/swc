//// [staticAutoAccessorsWithDecorators.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!    ,-[5:1]
//!  2 | 
//!  3 | class A {
//!  4 |     // uses class reference
//!  5 |     @((t, c) => {})
//!    :     ^
//!  6 |     static accessor x = 1;
//!  7 | 
//!  8 |     // uses 'this'
//!    `----
