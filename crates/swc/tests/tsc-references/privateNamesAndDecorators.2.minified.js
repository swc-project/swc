//// [privateNamesAndDecorators.ts]
//! 
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!    ,-[1:1]
//!  1 | declare function dec<T>(target: T): T;
//!  2 | 
//!  3 | class A {
//!  4 |     @dec                // Error
//!    :     ^
//!  5 |     #foo = 1;
//!  6 |     @dec                // Error
//!  7 |     #bar(): void { }
//!    `----
