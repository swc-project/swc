//// [deleteOperatorWithEnumType.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//!  7 | var ResultIsBoolean1 = delete ENUM;
//!    :                               ^^^^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  7 | var ResultIsBoolean1 = delete ENUM;
//!    :                               ^^^^
//!    `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//!  8 | var ResultIsBoolean2 = delete ENUM1;
//!    :                               ^^^^^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  8 | var ResultIsBoolean2 = delete ENUM1;
//!    :                               ^^^^^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  12 | var ResultIsBoolean4 = delete (ENUM[0] + ENUM1["B"]);
//!     :                                ^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!     :                                      ^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!     :                                      ^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!     :                               ^^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     :                                              ^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     :                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     :                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  19 | delete ENUM;
//!     :        ^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  19 | delete ENUM;
//!     :        ^^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  20 | delete ENUM1;
//!     :        ^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  20 | delete ENUM1;
//!     :        ^^^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  22 | delete ENUM, ENUM1;
//!     :        ^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  22 | delete ENUM, ENUM1;
//!     :        ^^^^
//!     `----
