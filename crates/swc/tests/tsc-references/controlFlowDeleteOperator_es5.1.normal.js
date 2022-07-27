//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 16 | delete x;  // No effect
//!    :        ^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 16 | delete x;  // No effect
//!    :        ^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
