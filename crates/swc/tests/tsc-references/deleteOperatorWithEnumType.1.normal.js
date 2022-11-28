//// [deleteOperatorWithEnumType.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!    ,-[5:1]
//!  5 | 
//!  6 | // enum type var
//!  7 | var ResultIsBoolean1 = delete ENUM;
//!    :                               ^^^^
//!  8 | var ResultIsBoolean2 = delete ENUM1;
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,-[5:1]
//!  5 | 
//!  6 | // enum type var
//!  7 | var ResultIsBoolean1 = delete ENUM;
//!    :                               ^^^^
//!  8 | var ResultIsBoolean2 = delete ENUM1;
//!    `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[6:1]
//!   6 | // enum type var
//!   7 | var ResultIsBoolean1 = delete ENUM;
//!   8 | var ResultIsBoolean2 = delete ENUM1;
//!     :                               ^^^^^
//!   9 | 
//!  10 | // enum type expressions
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[6:1]
//!   6 | // enum type var
//!   7 | var ResultIsBoolean1 = delete ENUM;
//!   8 | var ResultIsBoolean2 = delete ENUM1;
//!     :                               ^^^^^
//!   9 | 
//!  10 | // enum type expressions
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[10:1]
//!  10 | // enum type expressions
//!  11 | var ResultIsBoolean3 = delete ENUM1["A"];
//!  12 | var ResultIsBoolean4 = delete (ENUM[0] + ENUM1["B"]);
//!     :                                ^^^^^^^^^^^^^^^^^^^^
//!  13 | 
//!  14 | // multiple delete  operators
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[13:1]
//!  13 | 
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!     :                                      ^^^^
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[13:1]
//!  13 | 
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!     :                                      ^^^^
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[13:1]
//!  13 | 
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!     :                               ^^^^^^^^^^^
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[14:1]
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     :                                              ^^^^^^^^^^^^^^^^^^^^
//!  17 | 
//!  18 | // miss assignment operators
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[14:1]
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     :                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  17 | 
//!  18 | // miss assignment operators
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[14:1]
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     :                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  17 | 
//!  18 | // miss assignment operators
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[17:1]
//!  17 | 
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!     :        ^^^^
//!  20 | delete ENUM1;
//!  21 | delete ENUM1.B;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[17:1]
//!  17 | 
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!     :        ^^^^
//!  20 | delete ENUM1;
//!  21 | delete ENUM1.B;
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[18:1]
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!  20 | delete ENUM1;
//!     :        ^^^^^
//!  21 | delete ENUM1.B;
//!  22 | delete ENUM, ENUM1;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[18:1]
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!  20 | delete ENUM1;
//!     :        ^^^^^
//!  21 | delete ENUM1.B;
//!  22 | delete ENUM, ENUM1;
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[20:1]
//!  20 | delete ENUM1;
//!  21 | delete ENUM1.B;
//!  22 | delete ENUM, ENUM1;
//!     :        ^^^^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[20:1]
//!  20 | delete ENUM1;
//!  21 | delete ENUM1.B;
//!  22 | delete ENUM, ENUM1;
//!     :        ^^^^
//!     `----
