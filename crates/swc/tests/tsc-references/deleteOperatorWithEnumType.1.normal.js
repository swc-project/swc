//// [deleteOperatorWithEnumType.ts]
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[7:1]
//!   4 | enum ENUM1 { A, B, "" };
//!   5 | 
//!   6 | // enum type var
//!   7 | var ResultIsBoolean1 = delete ENUM;
//!     :                               ^^^^
//!   8 | var ResultIsBoolean2 = delete ENUM1;
//!   9 | 
//!  10 | // enum type expressions
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[7:1]
//!   4 | enum ENUM1 { A, B, "" };
//!   5 | 
//!   6 | // enum type var
//!   7 | var ResultIsBoolean1 = delete ENUM;
//!     :                               ^^^^
//!   8 | var ResultIsBoolean2 = delete ENUM1;
//!   9 | 
//!  10 | // enum type expressions
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[8:1]
//!   5 | 
//!   6 | // enum type var
//!   7 | var ResultIsBoolean1 = delete ENUM;
//!   8 | var ResultIsBoolean2 = delete ENUM1;
//!     :                               ^^^^^
//!   9 | 
//!  10 | // enum type expressions
//!  11 | var ResultIsBoolean3 = delete ENUM1["A"];
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[8:1]
//!   5 | 
//!   6 | // enum type var
//!   7 | var ResultIsBoolean1 = delete ENUM;
//!   8 | var ResultIsBoolean2 = delete ENUM1;
//!     :                               ^^^^^
//!   9 | 
//!  10 | // enum type expressions
//!  11 | var ResultIsBoolean3 = delete ENUM1["A"];
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[12:1]
//!   9 | 
//!  10 | // enum type expressions
//!  11 | var ResultIsBoolean3 = delete ENUM1["A"];
//!  12 | var ResultIsBoolean4 = delete (ENUM[0] + ENUM1["B"]);
//!     :                                ^^^^^^^^^^^^^^^^^^^^
//!  13 | 
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[15:1]
//!  12 | var ResultIsBoolean4 = delete (ENUM[0] + ENUM1["B"]);
//!  13 | 
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!     :                                      ^^^^
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!  17 | 
//!  18 | // miss assignment operators
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[15:1]
//!  12 | var ResultIsBoolean4 = delete (ENUM[0] + ENUM1["B"]);
//!  13 | 
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!     :                                      ^^^^
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!  17 | 
//!  18 | // miss assignment operators
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[15:1]
//!  12 | var ResultIsBoolean4 = delete (ENUM[0] + ENUM1["B"]);
//!  13 | 
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!     :                               ^^^^^^^^^^^
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!  17 | 
//!  18 | // miss assignment operators
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[16:1]
//!  13 | 
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     :                                              ^^^^^^^^^^^^^^^^^^^^
//!  17 | 
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[16:1]
//!  13 | 
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     :                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  17 | 
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[16:1]
//!  13 | 
//!  14 | // multiple delete  operators
//!  15 | var ResultIsBoolean5 = delete delete ENUM;
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!     :                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  17 | 
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[19:1]
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!  17 | 
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!     :        ^^^^
//!  20 | delete ENUM1;
//!  21 | delete ENUM1.B;
//!  22 | delete ENUM, ENUM1;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[19:1]
//!  16 | var ResultIsBoolean6 = delete delete delete (ENUM[0] + ENUM1["B"]);
//!  17 | 
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!     :        ^^^^
//!  20 | delete ENUM1;
//!  21 | delete ENUM1.B;
//!  22 | delete ENUM, ENUM1;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[20:1]
//!  17 | 
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!  20 | delete ENUM1;
//!     :        ^^^^^
//!  21 | delete ENUM1.B;
//!  22 | delete ENUM, ENUM1;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[20:1]
//!  17 | 
//!  18 | // miss assignment operators
//!  19 | delete ENUM;
//!  20 | delete ENUM1;
//!     :        ^^^^^
//!  21 | delete ENUM1.B;
//!  22 | delete ENUM, ENUM1;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[22:1]
//!  19 | delete ENUM;
//!  20 | delete ENUM1;
//!  21 | delete ENUM1.B;
//!  22 | delete ENUM, ENUM1;
//!     :        ^^^^
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[22:1]
//!  19 | delete ENUM;
//!  20 | delete ENUM1;
//!  21 | delete ENUM1.B;
//!  22 | delete ENUM, ENUM1;
//!     :        ^^^^
//!     `----
