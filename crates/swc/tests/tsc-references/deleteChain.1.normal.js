//// [deleteChain.ts]
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  4 | delete (o1?.b);
//!    :         ^^^^^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  8 | delete (o2?.b.c);
//!    :         ^^^^^^^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  12 | delete (o3.b?.c);
//!     :         ^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  17 | delete (o4.b?.c.d?.e);
//!     :         ^^^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  21 | delete (o5.b?.().c.d?.e);
//!     :         ^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  25 | delete (o6.b?.['c'].d?.['e']);
//!     :         ^^^^^^^^^^^^^^^^^^^^
//!     `----
