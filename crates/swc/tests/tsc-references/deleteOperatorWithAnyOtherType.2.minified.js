//// [deleteOperatorWithAnyOtherType.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  25 | var ResultIsBoolean1 = delete ANY1;
//!     :                               ^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  25 | var ResultIsBoolean1 = delete ANY1;
//!     :                               ^^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  26 | var ResultIsBoolean2 = delete ANY2;
//!     :                               ^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  26 | var ResultIsBoolean2 = delete ANY2;
//!     :                               ^^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  27 | var ResultIsBoolean3 = delete A;
//!     :                               ^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  27 | var ResultIsBoolean3 = delete A;
//!     :                               ^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  28 | var ResultIsBoolean4 = delete M;
//!     :                               ^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  28 | var ResultIsBoolean4 = delete M;
//!     :                               ^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  29 | var ResultIsBoolean5 = delete obj;
//!     :                               ^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  29 | var ResultIsBoolean5 = delete obj;
//!     :                               ^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  30 | var ResultIsBoolean6 = delete obj1;
//!     :                               ^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  30 | var ResultIsBoolean6 = delete obj1;
//!     :                               ^^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  33 | var ResultIsBoolean7 = delete undefined;
//!     :                               ^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  33 | var ResultIsBoolean7 = delete undefined;
//!     :                               ^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  34 | var ResultIsBoolean8 = delete null;
//!     :                               ^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  42 | var ResultIsBoolean14 = delete foo();
//!     :                                ^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  43 | var ResultIsBoolean15 = delete A.foo();
//!     :                                ^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  44 | var ResultIsBoolean16 = delete (ANY + ANY1);
//!     :                                 ^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  45 | var ResultIsBoolean17 = delete (null + undefined);
//!     :                                 ^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  46 | var ResultIsBoolean18 = delete (null + null);
//!     :                                 ^^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  47 | var ResultIsBoolean19 = delete (undefined + undefined);
//!     :                                 ^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  50 | var ResultIsBoolean20 = delete delete ANY;
//!     :                                       ^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  50 | var ResultIsBoolean20 = delete delete ANY;
//!     :                                       ^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  50 | var ResultIsBoolean20 = delete delete ANY;
//!     :                                ^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  51 | var ResultIsBoolean21 = delete delete delete (ANY + ANY1);
//!     :                                               ^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  51 | var ResultIsBoolean21 = delete delete delete (ANY + ANY1);
//!     :                                       ^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  51 | var ResultIsBoolean21 = delete delete delete (ANY + ANY1);
//!     :                                ^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  54 | delete ANY;
//!     :        ^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  54 | delete ANY;
//!     :        ^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  55 | delete ANY1;
//!     :        ^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  55 | delete ANY1;
//!     :        ^^^^
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  57 | delete ANY, ANY1;
//!     :        ^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  57 | delete ANY, ANY1;
//!     :        ^^^
//!     `----
