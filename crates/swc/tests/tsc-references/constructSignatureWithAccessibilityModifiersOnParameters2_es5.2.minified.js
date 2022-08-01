//!
//!  x A parameter property is only allowed in a constructor implementation
//!   ,----
//! 4 | constructor(public x, private y);
//!   :             ^^^^^^^^
//!   `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!   ,----
//! 4 | constructor(public x, private y);
//!   :                       ^^^^^^^^^
//!   `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!   ,----
//! 9 | constructor(private x);
//!   :             ^^^^^^^^^
//!   `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 14 | constructor(private x);
//!    :             ^^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 19 | new (public x);
//!    :      ^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 20 | new (public x);
//!    :      ^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 24 | new (private x);
//!    :      ^^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 25 | new (private x);
//!    :      ^^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 29 | new (public x);
//!    :      ^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 30 | new (public y);
//!    :      ^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 34 | new (private x);
//!    :      ^^^^^^^^^
//!    `----
//!
//!  x A parameter property is only allowed in a constructor implementation
//!    ,----
//! 35 | new (private y);
//!    :      ^^^^^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
