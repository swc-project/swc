//!
//!  x The operand of a delete operator must be a property reference.
//!   ,----
//! 5 | delete (o1?.b);
//!   :         ^^^^^
//!   `----
//!
//!  x The operand of a delete operator must be a property reference.
//!   ,----
//! 9 | delete (o2?.b.c);
//!   :         ^^^^^^^
//!   `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 13 | delete (o3.b?.c);
//!    :         ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 18 | delete (o4.b?.c.d?.e);
//!    :         ^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 22 | delete (o5.b?.().c.d?.e);
//!    :         ^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 26 | delete (o6.b?.['c'].d?.['e']);
//!    :         ^^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
