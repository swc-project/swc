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
//!  5 | 
//!  6 | interface B {
//!    `----
//! 
//!   x private names are not allowed in interface
//!    ,-[4:1]
//!  4 | }
//!  5 | 
//!  6 | interface B {
//!  7 |     #foo: string;
//!    :     ^^^^
//!  8 |     #bar(): string;
//!  9 | }
//!    `----
//! 
//!   x private names are not allowed in interface
//!     ,-[5:1]
//!   5 | 
//!   6 | interface B {
//!   7 |     #foo: string;
//!   8 |     #bar(): string;
//!     :     ^^^^
//!   9 | }
//!  10 | 
//!  11 | declare const x: {
//!     `----
//! 
//!   x private names are not allowed in interface
//!     ,-[9:1]
//!   9 | }
//!  10 | 
//!  11 | declare const x: {
//!  12 |     #foo: number;
//!     :     ^^^^
//!  13 |     bar: {
//!  14 |         #baz: string;
//!  15 |         #taz(): string;
//!     `----
//! 
//!   x private names are not allowed in interface
//!     ,-[11:1]
//!  11 | declare const x: {
//!  12 |     #foo: number;
//!  13 |     bar: {
//!  14 |         #baz: string;
//!     :         ^^^^
//!  15 |         #taz(): string;
//!  16 |     }
//!  17 |     #baz(): string;
//!     `----
//! 
//!   x private names are not allowed in interface
//!     ,-[12:1]
//!  12 |     #foo: number;
//!  13 |     bar: {
//!  14 |         #baz: string;
//!  15 |         #taz(): string;
//!     :         ^^^^
//!  16 |     }
//!  17 |     #baz(): string;
//!  18 | };
//!     `----
//! 
//!   x private names are not allowed in interface
//!     ,-[14:1]
//!  14 |         #baz: string;
//!  15 |         #taz(): string;
//!  16 |     }
//!  17 |     #baz(): string;
//!     :     ^^^^
//!  18 | };
//!  19 | 
//!  20 | declare const y: [{ qux: { #quux: 3 } }];
//!     `----
//! 
//!   x private names are not allowed in interface
//!     ,-[17:1]
//!  17 |     #baz(): string;
//!  18 | };
//!  19 | 
//!  20 | declare const y: [{ qux: { #quux: 3 } }];
//!     :                            ^^^^^
//!     `----
