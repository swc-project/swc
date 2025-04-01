//// [constructSignatureWithAccessibilityModifiersOnParameters.ts]
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[16:1]
//!  13 | }
//!  14 | 
//!  15 | interface I {
//!  16 |     new (public x);
//!     :          ^^^^^^^^
//!  17 | }
//!  18 | 
//!  19 | interface I2 {
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[20:1]
//!  17 | }
//!  18 | 
//!  19 | interface I2 {
//!  20 |     new (private x);
//!     :          ^^^^^^^^^
//!  21 | }
//!  22 | 
//!  23 | var a: {
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[24:1]
//!  21 | }
//!  22 | 
//!  23 | var a: {
//!  24 |     new (public x);
//!     :          ^^^^^^^^
//!  25 | }
//!  26 | 
//!  27 | var b: {
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[28:1]
//!  25 | }
//!  26 | 
//!  27 | var b: {
//!  28 |     new (private x);
//!     :          ^^^^^^^^^
//!  29 | }
//!     `----
