//// [privateNameAndPropertySignature.ts]
//! 
//!   x private names are now allowed in interface
//!    ,----
//!  2 | #foo: string;
//!    : ^^^^
//!    `----
//! 
//!   x private names are now allowed in interface
//!    ,----
//!  3 | #bar(): string;
//!    : ^^^^
//!    `----
//! 
//!   x private names are now allowed in interface
//!    ,----
//!  7 | #foo: string;
//!    : ^^^^
//!    `----
//! 
//!   x private names are now allowed in interface
//!    ,----
//!  8 | #bar(): string;
//!    : ^^^^
//!    `----
//! 
//!   x private names are now allowed in interface
//!     ,----
//!  12 | #foo: number;
//!     : ^^^^
//!     `----
//! 
//!   x private names are now allowed in interface
//!     ,----
//!  14 | #baz: string;
//!     : ^^^^
//!     `----
//! 
//!   x private names are now allowed in interface
//!     ,----
//!  15 | #taz(): string;
//!     : ^^^^
//!     `----
//! 
//!   x private names are now allowed in interface
//!     ,----
//!  17 | #baz(): string;
//!     : ^^^^
//!     `----
//! 
//!   x private names are now allowed in interface
//!     ,----
//!  20 | declare const y: [{ qux: { #quux: 3 } }];
//!     :                            ^^^^^
//!     `----
