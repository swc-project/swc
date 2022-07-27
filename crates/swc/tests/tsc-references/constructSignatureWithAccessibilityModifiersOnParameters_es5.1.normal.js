//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 16 | new (public x);
//!    :      ^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 20 | new (private x);
//!    :      ^^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 24 | new (public x);
//!    :      ^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 28 | new (private x);
//!    :      ^^^^^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
