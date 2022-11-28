//// [constructSignatureWithAccessibilityModifiersOnParameters.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[14:1]
//!  14 | 
//!  15 | interface I {
//!  16 |     new (public x);
//!     :          ^^^^^^^^
//!  17 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[18:1]
//!  18 | 
//!  19 | interface I2 {
//!  20 |     new (private x);
//!     :          ^^^^^^^^^
//!  21 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[22:1]
//!  22 | 
//!  23 | var a: {
//!  24 |     new (public x);
//!     :          ^^^^^^^^
//!  25 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[26:1]
//!  26 | 
//!  27 | var b: {
//!  28 |     new (private x);
//!     :          ^^^^^^^^^
//!  29 | }
//!     `----
