//!
//!  x This member cannot have an 'override' modifier because its containing class does not extend another class.
//!    ,----
//! 17 | override foo(v: string) {}
//!    : ^^^^^^^^
//!    `----
//!
//!  x This member cannot have an 'override' modifier because its containing class does not extend another class.
//!    ,----
//! 44 | override foo () {}
//!    : ^^^^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
