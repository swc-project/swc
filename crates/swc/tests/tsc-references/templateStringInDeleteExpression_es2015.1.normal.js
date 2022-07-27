//!
//!  x The operand of a delete operator must be a property reference.
//!   ,----
//! 1 | delete `abc${0}abc`;
//!   :        ^^^^^^^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
