//// [constructSignatureWithAccessibilityModifiersOnParameters2.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[2:1]
//!  2 | 
//!  3 | class C {
//!  4 |     constructor(public x, private y);
//!    :                 ^^^^^^^^
//!  5 |     constructor(public x, private y) { }
//!  6 | }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[2:1]
//!  2 | 
//!  3 | class C {
//!  4 |     constructor(public x, private y);
//!    :                           ^^^^^^^^^
//!  5 |     constructor(public x, private y) { }
//!  6 | }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[7:1]
//!   7 | 
//!   8 | class C2 {
//!   9 |     constructor(private x);
//!     :                 ^^^^^^^^^
//!  10 |     constructor(public x) { }
//!  11 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[12:1]
//!  12 | 
//!  13 | class C3 {
//!  14 |     constructor(private x);
//!     :                 ^^^^^^^^^
//!  15 |     constructor(private y) { }
//!  16 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[17:1]
//!  17 | 
//!  18 | interface I {
//!  19 |     new (public x);
//!     :          ^^^^^^^^
//!  20 |     new (public x);
//!  21 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[18:1]
//!  18 | interface I {
//!  19 |     new (public x);
//!  20 |     new (public x);
//!     :          ^^^^^^^^
//!  21 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[22:1]
//!  22 | 
//!  23 | interface I2 {
//!  24 |     new (private x);
//!     :          ^^^^^^^^^
//!  25 |     new (private x);
//!  26 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[23:1]
//!  23 | interface I2 {
//!  24 |     new (private x);
//!  25 |     new (private x);
//!     :          ^^^^^^^^^
//!  26 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[27:1]
//!  27 | 
//!  28 | var a: {
//!  29 |     new (public x);
//!     :          ^^^^^^^^
//!  30 |     new (public y);
//!  31 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[28:1]
//!  28 | var a: {
//!  29 |     new (public x);
//!  30 |     new (public y);
//!     :          ^^^^^^^^
//!  31 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[32:1]
//!  32 | 
//!  33 | var b: {
//!  34 |     new (private x);
//!     :          ^^^^^^^^^
//!  35 |     new (private y);
//!  36 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[33:1]
//!  33 | var b: {
//!  34 |     new (private x);
//!  35 |     new (private y);
//!     :          ^^^^^^^^^
//!  36 | }
//!     `----
