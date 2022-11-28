//// [privateNameAndPropertySignature.ts]
//! 
//!   x private names are not allowed in interface
//!    ,-[1:1]
//!  1 | type A = {
//!  2 |     #foo: string;
//!    :     ^^^^
//!  3 |     #bar(): string;
//!  4 | }
//!    `----
//! 
//!   x private names are not allowed in interface
//!    ,-[1:1]
//!  1 | type A = {
//!  2 |     #foo: string;
//!  3 |     #bar(): string;
//!    :     ^^^^
//!  4 | }
//!    `----
//! 
//!   x private names are not allowed in interface
//!    ,-[5:1]
//!  5 | 
//!  6 | interface B {
//!  7 |     #foo: string;
//!    :     ^^^^
//!  8 |     #bar(): string;
//!  9 | }
//!    `----
//! 
//!   x private names are not allowed in interface
//!    ,-[6:1]
//!  6 | interface B {
//!  7 |     #foo: string;
//!  8 |     #bar(): string;
//!    :     ^^^^
//!  9 | }
//!    `----
//! 
//!   x private names are not allowed in interface
//!     ,-[10:1]
//!  10 | 
//!  11 | declare const x: {
//!  12 |     #foo: number;
//!     :     ^^^^
//!  13 |     bar: {
//!  14 |         #baz: string;
//!     `----
//! 
//!   x private names are not allowed in interface
//!     ,-[12:1]
//!  12 |     #foo: number;
//!  13 |     bar: {
//!  14 |         #baz: string;
//!     :         ^^^^
//!  15 |         #taz(): string;
//!  16 |     }
//!     `----
//! 
//!   x private names are not allowed in interface
//!     ,-[13:1]
//!  13 |     bar: {
//!  14 |         #baz: string;
//!  15 |         #taz(): string;
//!     :         ^^^^
//!  16 |     }
//!  17 |     #baz(): string;
//!     `----
//! 
//!   x private names are not allowed in interface
//!     ,-[15:1]
//!  15 |         #taz(): string;
//!  16 |     }
//!  17 |     #baz(): string;
//!     :     ^^^^
//!  18 | };
//!     `----
//! 
//!   x private names are not allowed in interface
//!     ,-[18:1]
//!  18 | };
//!  19 | 
//!  20 | declare const y: [{ qux: { #quux: 3 } }];
//!     :                            ^^^^^
//!     `----
