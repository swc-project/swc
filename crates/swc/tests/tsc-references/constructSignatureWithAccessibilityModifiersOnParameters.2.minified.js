//// [constructSignatureWithAccessibilityModifiersOnParameters.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  16 | new (public x);
//!     :      ^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  20 | new (private x);
//!     :      ^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  24 | new (public x);
//!     :      ^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  28 | new (private x);
//!     :      ^^^^^^^^^
//!     `----
