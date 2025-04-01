//// [constructSignatureWithAccessibilityModifiersOnParameters2.ts]
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[4:1]
//!  1 | // Parameter properties are not valid in overloads of constructors
//!  2 | 
//!  3 | class C {
//!  4 |     constructor(public x, private y);
//!    :                 ^^^^^^^^
//!  5 |     constructor(public x, private y) { }
//!  6 | }
//!    `----
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[4:1]
//!  1 | // Parameter properties are not valid in overloads of constructors
//!  2 | 
//!  3 | class C {
//!  4 |     constructor(public x, private y);
//!    :                           ^^^^^^^^^
//!  5 |     constructor(public x, private y) { }
//!  6 | }
//!    `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[9:1]
//!   6 | }
//!   7 | 
//!   8 | class C2 {
//!   9 |     constructor(private x);
//!     :                 ^^^^^^^^^
//!  10 |     constructor(public x) { }
//!  11 | }
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[14:1]
//!  11 | }
//!  12 | 
//!  13 | class C3 {
//!  14 |     constructor(private x);
//!     :                 ^^^^^^^^^
//!  15 |     constructor(private y) { }
//!  16 | }
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[19:1]
//!  16 | }
//!  17 | 
//!  18 | interface I {
//!  19 |     new (public x);
//!     :          ^^^^^^^^
//!  20 |     new (public x);
//!  21 | }
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[20:1]
//!  17 | 
//!  18 | interface I {
//!  19 |     new (public x);
//!  20 |     new (public x);
//!     :          ^^^^^^^^
//!  21 | }
//!  22 | 
//!  23 | interface I2 {
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[24:1]
//!  21 | }
//!  22 | 
//!  23 | interface I2 {
//!  24 |     new (private x);
//!     :          ^^^^^^^^^
//!  25 |     new (private x);
//!  26 | }
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[25:1]
//!  22 | 
//!  23 | interface I2 {
//!  24 |     new (private x);
//!  25 |     new (private x);
//!     :          ^^^^^^^^^
//!  26 | }
//!  27 | 
//!  28 | var a: {
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[29:1]
//!  26 | }
//!  27 | 
//!  28 | var a: {
//!  29 |     new (public x);
//!     :          ^^^^^^^^
//!  30 |     new (public y);
//!  31 | }
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[30:1]
//!  27 | 
//!  28 | var a: {
//!  29 |     new (public x);
//!  30 |     new (public y);
//!     :          ^^^^^^^^
//!  31 | }
//!  32 | 
//!  33 | var b: {
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[34:1]
//!  31 | }
//!  32 | 
//!  33 | var b: {
//!  34 |     new (private x);
//!     :          ^^^^^^^^^
//!  35 |     new (private y);
//!  36 | }
//!     `----
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[35:1]
//!  32 | 
//!  33 | var b: {
//!  34 |     new (private x);
//!  35 |     new (private y);
//!     :          ^^^^^^^^^
//!  36 | }
//!     `----
